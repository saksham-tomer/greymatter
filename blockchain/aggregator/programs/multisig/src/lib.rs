use anchor_lang::prelude::*;
use anchor_lang::solana_program::instruction::{AccountMeta, Instruction};
use anchor_lang::solana_program::program::invoke;
use anchor_spl::token::{self, Token, TokenAccount};

declare_id!("FrJ5pV4EevMzSkVSukdvGtmfqWRCwS9pCQfqFC8AEPVF"); // Replace with your Aggregator Program ID

#[program]
pub mod aggregator {
    use super::*;

    /// Initializes the Aggregator account
    pub fn initialize_aggregator(ctx: Context<InitializeAggregator>) -> Result<()> {
        let aggregator_account = &mut ctx.accounts.aggregator_account;
        aggregator_account.best_pool_key = Pubkey::default();
        aggregator_account.best_apy_bps = 0;
        aggregator_account.last_checked_slot = 0;
        Ok(())
    }

    /// Fetches APY data from Oracle and Pool, determines the best pool, and updates state
    pub fn find_best_yield(
        ctx: Context<FindBestYield>,
        oracle_account_pubkey: Pubkey,
        pool_account_pubkey: Pubkey,
    ) -> Result<()> {
        let aggregator_account = &mut ctx.accounts.aggregator_account;

        // Fetch APY from Oracle
        let oracle_account_info = ctx.accounts.oracle_account.clone();
        let oracle_account = OracleAccount::try_from_slice(&oracle_account_info.try_borrow_data()?)
            .map_err(|_| CustomError::OracleDeserializationFailed)?;

        // Fetch APY from Pool
        let pool_account_info = ctx.accounts.pool_account.clone();
        let pool_account = PoolAccount::try_from_slice(&pool_account_info.try_borrow_data()?)
            .map_err(|_| CustomError::PoolDeserializationFailed)?;

        // Combine APYs
        let total_apy = oracle_account
            .base_apy_bps
            .checked_add(pool_account.pool_apy_bps)
            .ok_or(CustomError::NumericalOverflow)?;

        // Determine if this pool has the best APY
        if total_apy > aggregator_account.best_apy_bps {
            aggregator_account.best_apy_bps = total_apy;
            aggregator_account.best_pool_key = pool_account_pubkey;
        }

        aggregator_account.last_checked_slot = Clock::get()?.slot;

        Ok(())
    }

    /// Deposits a specified amount into the best yield pool via CPI
    pub fn deposit_into_best(
        ctx: Context<DepositIntoBest>,
        pool_program_id: Pubkey,
        amount: u64,
    ) -> Result<()> {
        let aggregator_account = &ctx.accounts.aggregator_account;

        require!(
            aggregator_account.best_pool_key != Pubkey::default(),
            CustomError::NoBestPoolFound
        );

        // Construct the deposit instruction data
        let deposit_instruction = DepositInstruction { amount };
        let deposit_data = deposit_instruction.to_bytes();

        // Construct the CPI instruction
        let deposit_ix = Instruction {
            program_id: pool_program_id,
            accounts: vec![
                AccountMeta::new(aggregator_account.best_pool_key, false), // pool_account
                AccountMeta::new(ctx.accounts.user_token_account.key(), false), // user_token_account
                AccountMeta::new(ctx.accounts.pool_vault.key(), false),         // pool_vault
                AccountMeta::new_readonly(ctx.accounts.token_program.key(), false), // token_program
                AccountMeta::new(ctx.accounts.user.key(), true), // depositor (signer)
            ],
            data: deposit_data,
        };

        // Invoke the CPI
        invoke(
            &deposit_ix,
            &[
                ctx.accounts.pool_program.to_account_info(),
                ctx.accounts.user_token_account.to_account_info(),
                ctx.accounts.pool_vault.to_account_info(),
                ctx.accounts.token_program.to_account_info(),
                ctx.accounts.user.to_account_info(),
            ],
        )?;

        Ok(())
    }
}

/// Instruction data for Pool's deposit
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct DepositInstruction {
    pub amount: u64,
}

impl DepositInstruction {
    pub fn to_bytes(&self) -> Vec<u8> {
        let mut data = Vec::new();
        // Assuming the Pool program uses an instruction index for 'deposit', e.g., 1
        data.push(1); // Instruction index for 'deposit'
        data.extend_from_slice(&self.amount.to_le_bytes());
        data
    }
}

/// Context for initializing the Aggregator
#[derive(Accounts)]
pub struct InitializeAggregator<'info> {
    #[account(init, payer = authority, space = 8 + 32 + 2 + 8)]
    pub aggregator_account: Account<'info, AggregatorAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

/// Context for finding the best yield
#[derive(Accounts)]
pub struct FindBestYield<'info> {
    #[account(mut)]
    pub aggregator_account: Account<'info, AggregatorAccount>,
    /// Oracle account (read-only)
    pub oracle_account: AccountInfo<'info>,
    /// Pool account (read-only)
    pub pool_account: AccountInfo<'info>,
}

/// Context for depositing into the best pool
#[derive(Accounts)]
pub struct DepositIntoBest<'info> {
    #[account(mut)]
    pub aggregator_account: Account<'info, AggregatorAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    /// User's token account
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    /// Pool's vault token account
    #[account(mut)]
    pub pool_vault: Account<'info, TokenAccount>,
    /// Pool program account (read-only)
    pub pool_program: AccountInfo<'info>,
    /// SPL Token program
    pub token_program: Program<'info, Token>,
}

/// Aggregator's state
#[account]
pub struct AggregatorAccount {
    pub best_pool_key: Pubkey,
    pub best_apy_bps: u16,
    pub last_checked_slot: u64,
}

/// Custom error codes
#[error_code]
pub enum CustomError {
    #[msg("No best pool found. Run find_best_yield first.")]
    NoBestPoolFound,

    #[msg("Numerical overflow occurred.")]
    NumericalOverflow,

    #[msg("Failed to deserialize Oracle account.")]
    OracleDeserializationFailed,

    #[msg("Failed to deserialize Pool account.")]
    PoolDeserializationFailed,
}

/// Oracle account structure (must match Oracle program)
#[derive(AnchorDeserialize, AnchorSerialize, Clone, Debug)]
pub struct OracleAccount {
    pub base_price: u64,
    pub base_apy_bps: u16, // Basis points of APY, e.g., 2500 = 25%
}

/// Pool account structure (must match Pool program)
#[derive(AnchorDeserialize, AnchorSerialize, Clone, Debug)]
pub struct PoolAccount {
    pub total_liquidity: u64,
    pub pool_apy_bps: u16,
    pub num_depositors: u64,
}
