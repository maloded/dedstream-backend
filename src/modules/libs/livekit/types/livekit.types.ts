import type { FactoryProvider, ModuleMetadata } from '@nestjs/common';

export const LiveKitOptionsSymbol = Symbol('LiveKitOptionsSymbol');

export type TypeLiveKitOptions = {
	apiKey: string;
	apiSecret: string;
	apiUrl: string;
};

export type TypeLiveKitAsyncOptions = Pick<ModuleMetadata, 'imports'> &
	Pick<FactoryProvider<TypeLiveKitOptions>, 'useFactory' | 'inject'>;
