use anchor_lang::prelude::*;
use anchor_lang::solana_program::{
    instruction::{AccountMeta, Instruction},
    program::invoke,
    system_program,
};

declare_id!("3zXKff5skVoTMLRhPAPM6TDfzrsLtZwozsYabjxdqTU9");

#[program]
pub mod multisig_wallet {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        owners: Vec<Pubkey>,
        threshold: u64,
    ) -> Result<()> {
        require!(
            threshold as usize <= owners.len(),
            CustomError::InvalidThreshold
        );
        require!(threshold > 0, CustomError::InvalidThreshold);
        require!(!owners.is_empty(), CustomError::NoOwners);

        let multisig = &mut ctx.accounts.multisig;
        multisig.owners = owners;
        multisig.threshold = threshold;
        multisig.nonce = 0;
        multisig.owner_sequence_number = 0;
        Ok(())
    }

    pub fn create_transaction(
        ctx: Context<CreateTransaction>,
        program_id: Pubkey,
        accounts: Vec<TransactionAccount>,
        data: Vec<u8>,
    ) -> Result<()> {
        let multisig = &ctx.accounts.multisig;
        require!(
            multisig.owners.contains(&ctx.accounts.proposer.key()),
            CustomError::NotAnOwner
        );

        let tx = &mut ctx.accounts.transaction;
        tx.program_id = program_id;
        tx.accounts = accounts;
        tx.data = data;
        tx.did_execute = false;
        tx.signers = vec![false; multisig.owners.len()];
        
        // Set the proposer's signature
        let owner_index = multisig
            .owners
            .iter()
            .position(|owner| owner == &ctx.accounts.proposer.key())
            .unwrap();
        tx.signers[owner_index] = true;

        Ok(())
    }

    pub fn approve(ctx: Context<Approve>) -> Result<()> {
        let multisig = &ctx.accounts.multisig;
        let transaction = &mut ctx.accounts.transaction;

        require!(!transaction.did_execute, CustomError::AlreadyExecuted);
        
        // Check if the signer is an owner
        let owner_index = multisig
            .owners
            .iter()
            .position(|owner| owner == &ctx.accounts.owner.key())
            .ok_or(CustomError::NotAnOwner)?;

        transaction.signers[owner_index] = true;

        Ok(())
    }

    pub fn execute_transaction(ctx: Context<ExecuteTransaction>) -> Result<()> {
        let multisig = &ctx.accounts.multisig;
        let transaction = &mut ctx.accounts.transaction;

        require!(!transaction.did_execute, CustomError::AlreadyExecuted);

        // Check if we have enough signatures
        let sig_count = transaction.signers.iter().filter(|&&signed| signed).count() as u64;
        require!(
            sig_count >= multisig.threshold,
            CustomError::NotEnoughSignatures
        );

        // Execute the transaction
        let mut account_metas = Vec::new();
        for acc in &transaction.accounts {
            account_metas.push(if acc.is_writable {
                if acc.is_signer {
                    AccountMeta::new(acc.pubkey, true)
                } else {
                    AccountMeta::new(acc.pubkey, false)
                }
            } else {
                if acc.is_signer {
                    AccountMeta::new_readonly(acc.pubkey, true)
                } else {
                    AccountMeta::new_readonly(acc.pubkey, false)
                }
            });
        }

        let instruction = Instruction {
            program_id: transaction.program_id,
            accounts: account_metas,
            data: transaction.data.clone(),
        };

        invoke(
            &instruction,
            ctx.remaining_accounts,
        )?;

        transaction.did_execute = true;

        Ok(())
    }

    pub fn change_owners(
        ctx: Context<ChangeOwners>,
        new_owners: Vec<Pubkey>,
        new_threshold: u64,
    ) -> Result<()> {
        let multisig = &mut ctx.accounts.multisig;
        
        require!(
            new_threshold as usize <= new_owners.len(),
            CustomError::InvalidThreshold
        );
        require!(new_threshold > 0, CustomError::InvalidThreshold);
        require!(!new_owners.is_empty(), CustomError::NoOwners);

        multisig.owners = new_owners;
        multisig.threshold = new_threshold;
        multisig.owner_sequence_number += 1;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + 32 * 10 + 8 + 8 + 8, // Adjust space based on max owners
    )]
    pub multisig: Account<'info, Multisig>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateTransaction<'info> {
    pub multisig: Account<'info, Multisig>,
    #[account(
        init,
        payer = proposer,
        space = 8 + 32 + 1000, // Adjust space based on your needs
    )]
    pub transaction: Account<'info, Transaction>,
    #[account(mut)]
    pub proposer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Approve<'info> {
    pub multisig: Account<'info, Multisig>,
    #[account(mut)]
    pub transaction: Account<'info, Transaction>,
    pub owner: Signer<'info>,
}

#[derive(Accounts)]
pub struct ExecuteTransaction<'info> {
    pub multisig: Account<'info, Multisig>,
    #[account(mut)]
    pub transaction: Account<'info, Transaction>,
    pub executor: Signer<'info>,
}

#[derive(Accounts)]
pub struct ChangeOwners<'info> {
    #[account(mut)]
    pub multisig: Account<'info, Multisig>,
    pub owner: Signer<'info>,
}

#[account]
pub struct Multisig {
    pub owners: Vec<Pubkey>,
    pub threshold: u64,
    pub nonce: u64,
    pub owner_sequence_number: u64,
}

#[account]
pub struct Transaction {
    pub program_id: Pubkey,
    pub accounts: Vec<TransactionAccount>,
    pub data: Vec<u8>,
    pub signers: Vec<bool>,
    pub did_execute: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct TransactionAccount {
    pub pubkey: Pubkey,
    pub is_signer: bool,
    pub is_writable: bool,
}

#[error_code]
pub enum CustomError {
    #[msg("The given threshold is invalid")]
    InvalidThreshold,
    #[msg("Owners list cannot be empty")]
    NoOwners,
    #[msg("Not enough signatures to execute the transaction")]
    NotEnoughSignatures,
    #[msg("Transaction has already been executed")]
    AlreadyExecuted,
    #[msg("Signer is not an owner")]
    NotAnOwner,
}