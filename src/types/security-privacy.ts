// app/password-generator/components/types.ts
export type PasswordOptions = {
    length: number;
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    symbols: boolean;
};

export type PasswordHistoryItem = {
    password: string;
    timestamp: Date;
};

export type CharacterSets = {
    uppercase: string;
    lowercase: string;
    numbers: string;
    symbols: string;
};
