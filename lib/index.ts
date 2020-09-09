
export function difference< T >( arr: Array< T >, from: Array< T > )
: Array< T >
{
	// Array is faster on small arrays with non-string primitives
	const useSet = from.length > 25 || typeof from[ 0 ] === 'string';
	if ( useSet )
	{
		const set = new Set( from );
		return arr.filter( val => !set.has( val ) );
	}
	else
		return arr.filter( val => !from.includes( val ) );
}

export function intersection< T >( arr: Array< T >, from: Array< T > )
: Array< T >
{
	// Array is faster on small arrays with non-string primitives
	const useSet = from.length > 25 || typeof from[ 0 ] === 'string';
	if ( useSet )
	{
		const set = new Set( from );
		return arr.filter( val => set.has( val ) );
	}
	else
		return arr.filter( val => from.includes( val ) );
}

export function instead< T >( target: T, source: T ): T
{
	const tTarget = target === null ? 'null' : typeof target;
	const tSource = source === null ? 'null' : typeof source;

	if ( tTarget !== tSource )
	{
		return source;
	}
	else if (
		tTarget === 'object' &&
		( Array.isArray( target ) !== Array.isArray( source ) )
	)
	{
		return source;
	}
	else if (
		tTarget === 'object' &&
		Array.isArray( target ) &&
		Array.isArray( source )
	)
	{
		const nTarget = target.length;
		const nSource = source.length;
		const nMin = Math.min( nTarget, nSource );
		let anyChanged = nTarget !== nSource;
		for ( let i = 0; i < nMin; ++i )
		{
			const newVal = instead( target[ i ], source[ i ] );
			if ( newVal !== target[ i ] )
				anyChanged = true;
			target[ i ] = newVal;
		}
		if ( nTarget > nSource )
			return target.slice( 0, nSource ) as any;
		else if ( nTarget < nSource )
			return [ ...target, ...source.slice( nTarget ) ] as any;
		return anyChanged ? [ ...target ] : target as any;
	}
	else if ( tTarget === 'object' )
	{
		let anyChanged = false;
		const sourceKeys = Object.keys( source ) as ( keyof T )[ ];
		const targetKeys = Object.keys( target ) as ( keyof T )[ ];
		const bothKeys = intersection(
			Object.keys( target ) as ( keyof T )[ ],
			sourceKeys
		);
		const extraSourceKeys = difference( sourceKeys, targetKeys );
		const newTarget = bothKeys.length < targetKeys.length;
		// // @ts-ignore
		// console.log("bothKeys.length < targetKeys.length", bothKeys.length, targetKeys.length)
		const maybeNewTarget = newTarget ? { } as T : target;

		for ( const key of bothKeys )
		{
			const oldVal = target[ key ];
			const newVal = instead( oldVal, source[ key ] );
			if ( newVal !== oldVal )
			{
				maybeNewTarget[ key ] = newVal;
				anyChanged = true;
			}
			else
				maybeNewTarget[ key ] = oldVal;
		}
		if ( extraSourceKeys.length > 0 )
		{
			for ( const key of extraSourceKeys )
				maybeNewTarget[ key ] = source[ key ];
			anyChanged = true;
		}
		return ( anyChanged && !newTarget )
			? { ...maybeNewTarget }
			: maybeNewTarget;
	}

	return target === source ? target : source;
}
