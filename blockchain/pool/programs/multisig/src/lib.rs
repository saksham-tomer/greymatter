use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("EsMiYxPWqYPHik9HVgTuY3ZaGRqEob9MaaK7WeVqhZgr");

#[program]
pub mod pool {
    use super::*;

    pub fn initialize_pool(
        ctx: Context<InitializePool>,
        initial_liquidity: u64,
        pool_apy_bps: u16,
    ) -> Result<()> {
        let pool_account = &mut ctx.accounts.pool_account;
        pool_account.total_liquidity = initial_liquidity;
        pool_account.pool_apy_bps = pool_apy_bps;
        pool_account.num_depositors = 0;
        Ok(())
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        let pool_account = &mut ctx.accounts.pool_account;

        // Transfer tokens from depositor to pool vault via CPI
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.pool_vault.to_account_info(),
            authority: ctx.accounts.depositor.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        // Update pool state
        pool_account.total_liquidity = pool_account
            .total_liquidity
            .checked_add(amount)
            .ok_or(CustomError::NumericalOverflow)?;
        pool_account.num_depositors += 1;
        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        let pool_account = &mut ctx.accounts.pool_account;

        // Ensure sufficient liquidity
        require!(
            pool_account.total_liquidity >= amount,
            CustomError::NotEnoughLiquidity
        );

        // Transfer tokens from pool vault to depositor via CPI
        let cpi_accounts = Transfer {
            from: ctx.accounts.pool_vault.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.pool_vault_authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();

        // **Fixed Code Starts Here**
        // Bind pool_account.key() to a variable to extend its lifetime
        let pool_key = pool_account.key();
        let seeds = &[b"pool_vault_authority", pool_key.as_ref()];
        let signer = &[&seeds[..]];
        // **Fixed Code Ends Here**

        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, amount)?;

        // Update pool state
        pool_account.total_liquidity = pool_account
            .total_liquidity
            .checked_sub(amount)
            .ok_or(CustomError::NumericalUnderflow)?;
        Ok(())
    }
}

#[account]
pub struct PoolAccount {
    pub total_liquidity: u64,
    pub pool_apy_bps: u16,
    pub num_depositors: u64,
}

#[derive(Accounts)]
pub struct InitializePool<'info> {
    #[account(init, payer = authority, space = 8 + 8 + 2 + 8)]
    pub pool_account: Account<'info, PoolAccount>,
    #[account(mut)]
    pub pool_vault: Account<'info, TokenAccount>,
    #[account(
        seeds = [b"pool_vault_authority", pool_account.key().as_ref()],
        bump,
    )]
    pub pool_vault_authority: AccountInfo<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub pool_account: Account<'info, PoolAccount>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub pool_vault: Account<'info, TokenAccount>,
    pub depositor: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub pool_account: Account<'info, PoolAccount>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub pool_vault: Account<'info, TokenAccount>,
    pub pool_vault_authority: AccountInfo<'info>,
    pub depositor: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[error_code]
pub enum CustomError {
    #[msg("Not enough liquidity in the pool.")]
    NotEnoughLiquidity,

    #[msg("Numerical overflow occurred.")]
    NumericalOverflow,

    #[msg("Numerical underflow occurred.")]
    NumericalUnderflow,
}
