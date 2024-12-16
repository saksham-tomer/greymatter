use anchor_lang::prelude::*;

declare_id!("3iLoqsNtqZq2mCCg7CPA9qd2T62vfbMLCAgSvASKzPNv");

#[program]
pub mod oracle {
    use super::*;

    pub fn initialize_oracle(ctx: Context<InitializeOracle>, base_price: u64, base_apy_bps: u16) -> Result<()> {
        let oracle_account = &mut ctx.accounts.oracle_account;
        oracle_account.base_price = base_price;
        oracle_account.base_apy_bps = base_apy_bps;
        Ok(())
    }

    pub fn update_oracle(ctx: Context<UpdateOracle>, new_price: u64, new_apy_bps: u16) -> Result<()> {
        let oracle_account = &mut ctx.accounts.oracle_account;
        oracle_account.base_price = new_price;
        oracle_account.base_apy_bps = new_apy_bps;
        Ok(())
    }
}

#[account]
pub struct OracleAccount {
    pub base_price: u64,
    pub base_apy_bps: u16, // Basis points of APY, e.g., 2500 = 25%
}

#[derive(Accounts)]
pub struct InitializeOracle<'info> {
    #[account(init, payer = authority, space = 8 + 8 + 2)]
    pub oracle_account: Account<'info, OracleAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateOracle<'info> {
    #[account(mut)]
    pub oracle_account: Account<'info, OracleAccount>,
    pub authority: Signer<'info>,
}
