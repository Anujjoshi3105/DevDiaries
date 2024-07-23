import { randomBytes } from 'crypto';
import { db } from '@/lib/db';
import { getVerificationTokenByEmail } from '@/data/verificationToken';
import { getPasswordTokenByEmail } from '@/data/passwordToken';

export async function generateVerificationToken(email: string) {
    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24);
    
    const existingToken = await getVerificationTokenByEmail(email);
    
    if (existingToken) {
        await db.verificationToken.delete({
            where: { email: existingToken.email, token: existingToken.token },
        });
    }

    const verificationToken = await db.verificationToken.create({
        data: {
            email,
            token,
            expires,
        },
    });

    return verificationToken;
}

export async function generatePasswordToken(email: string) {
    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24);
    
    const existingToken = await getPasswordTokenByEmail(email);
    
    if (existingToken) {
        await db.passwordToken.delete({
            where: { email: existingToken.email, token: existingToken.token },
        });
    }

    const passwordToken = await db.passwordToken.create({
        data: { 
            email,
            token,
            expires,
        },
    }); 

    return passwordToken;
}