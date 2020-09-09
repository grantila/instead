import { instead, difference, intersection } from './'

const getLargeNumbers = ( ) =>
	Array.from(
		Array( 100 )
	)
	.map( ( ) => Math.round( Math.random( ) * 1000 + 20 ) );

describe( "difference", ( ) =>
{
	it( "both empty", ( ) =>
	{
		expect( difference( [ ], [ ] ) ).toStrictEqual( [ ] );
	} );

	it( "first empty", ( ) =>
	{
		expect( difference( [ ], [ "foo", "bar" ] ) ).toStrictEqual( [ ] );
	} );

	it( "second empty", ( ) =>
	{
		expect( difference( [ "foo", "bar" ], [ ] ) )
			.toStrictEqual( [ "foo", "bar" ] );
	} );

	it( "no equal", ( ) =>
	{
		expect( difference( [ "foo" ], [ "bar" ] ) )
			.toStrictEqual( [ "foo" ] );
	} );

	it( "all equal", ( ) =>
	{
		expect( difference( [ "foo", "bar" ], [ "foo", "bar" ] ) )
			.toStrictEqual( [ ] );
	} );

	it( "some equal", ( ) =>
	{
		expect( difference( [ "bar", "bak" ], [ "foo", "bar", "baz" ] ) )
			.toStrictEqual( [ "bak" ] );
	} );

	it( "some equal, small non-string array", ( ) =>
	{
		const a = [ 1, 2, 3, 4, 5 ];
		const b = [ 4, 5, 6, 7, 8 ];
		expect( difference( a, b ) ).toStrictEqual( [ 1, 2, 3 ] );
	} );

	it( "some equal, large non-string array", ( ) =>
	{
		const a = [ 1, 2, 3, 4, 5 ];
		const b = [ 4, 5, 6, 7, 8, ...( getLargeNumbers( ) ) ];
		expect( difference( a, b ) ).toStrictEqual( [ 1, 2, 3 ] );
	} );
} );

describe( "intersection", ( ) =>
{
	it( "both empty", ( ) =>
	{
		expect( intersection( [ ], [ ] ) ).toStrictEqual( [ ] );
	} );

	it( "first empty", ( ) =>
	{
		expect( intersection( [ ], [ "foo", "bar" ] ) ).toStrictEqual( [ ] );
	} );

	it( "second empty", ( ) =>
	{
		expect( intersection( [ "foo", "bar" ], [ ] ) )
			.toStrictEqual( [ ] );
	} );

	it( "no equal", ( ) =>
	{
		expect( intersection( [ "foo" ], [ "bar" ] ) )
			.toStrictEqual( [ ] );
	} );

	it( "all equal", ( ) =>
	{
		expect( intersection( [ "foo", "bar" ], [ "foo", "bar" ] ) )
			.toStrictEqual( [ "foo", "bar" ] );
	} );

	it( "some equal", ( ) =>
	{
		expect( intersection( [ "bar", "bak" ], [ "foo", "bar", "baz" ] ) )
			.toStrictEqual( [ "bar" ] );
	} );

	it( "some equal, small non-string array", ( ) =>
	{
		const a = [ 1, 2, 3, 4, 5 ];
		const b = [ 4, 5, 6, 7, 8 ];
		expect( intersection( a, b ) ).toStrictEqual( [ 4, 5 ] );
	} );

	it( "some equal, large non-string array", ( ) =>
	{
		const a = [ 1, 2, 3, 4, 5 ];
		const b = [ 4, 5, 6, 7, 8, ...( getLargeNumbers( ) ) ];
		expect( intersection( a, b ) ).toStrictEqual( [ 4, 5 ] );
	} );
} );

describe( "instead", ( ) =>
{
	describe( "top-level type mismatch", ( ) =>
	{
		it( "null, object", ( ) =>
		{
			const source = { };
			expect( instead( null, source ) ).toBe( source );
		} );

		it( "null, string", ( ) =>
		{
			const source = "foo";
			expect( instead( null, source ) ).toBe( source );
		} );

		it( "object, null", ( ) =>
		{
			const source = null;
			expect( instead( { }, source ) ).toBe( source );
		} );

		it( "string, null", ( ) =>
		{
			const source = null;
			expect( instead( "foo", source ) ).toBe( source );
		} );

		it( "object, array", ( ) =>
		{
			const source = [ ] as unknown[ ];
			expect( instead( { }, source as any ) ).toBe( source );
		} );

		it( "array, object", ( ) =>
		{
			const source = { };
			expect( instead( [ ], source ) ).toBe( source );
		} );
	} );

	describe( "top-level primitives", ( ) =>
	{
		it( "should handle string", ( ) =>
		{
			expect( instead( "foo", "bar" ) ).toBe( "bar" );
		} );

		it( "should handle number", ( ) =>
		{
			expect( instead( 17, 42 ) ).toBe( 42 );
		} );

		it( "should handle boolean", ( ) =>
		{
			expect( instead( false, true ) ).toBe( true );
		} );

		it( "should handle null", ( ) =>
		{
			expect( instead( null, null ) ).toBe( null );
		} );
	} );

	describe( "complex", ( ) =>
	{
		it( "should handle adding and deleting entries", ( ) =>
		{
			const magic = { };
			const target = {
				foo: "f",
				obj: magic,
				bar: {
					baz: 42,
				},
				bak: 42,
			};
			const source = {
				foo: "f",
				obj: magic,
				baz: true,
			};
			const result = instead( target, source as any );
			expect( result ).not.toBe( target );
			expect( result ).not.toBe( source );
			expect( result.obj ).toBe( target.obj );
			expect( result ).toStrictEqual( {
				foo: "f",
				obj: magic,
				baz: true,
			} );
		} );

		it( "should handle changing properties", ( ) =>
		{
			const target = {
				foo: "f",
				bar: {
					baz: 42,
					bak: "17",
				},
				newtype: false,
			};
			const source = {
				foo: "g",
				bar: {
					baz: 42,
					bak: 17,
				},
				newtype: { a: "1" }
			};
			const result = instead( target, source as any );
			expect( result ).not.toBe( target );
			expect( result ).not.toBe( source );
			expect( result ).toStrictEqual( {
				foo: "g",
				bar: {
					baz: 42,
					bak: 17,
				},
				newtype: { a: "1" },
			} );
		} );

		it( "should handle changing elements", ( ) =>
		{
			const target = {
				foo: "f",
				arr: [
					42,
					{ bak: "17" },
				],
			};
			const source = {
				foo: "g",
				arr: [
					17,
					{ bak: "17" },
				],
			};
			const result = instead( target, source as any );
			expect( result ).not.toBe( target );
			expect( result ).not.toBe( source );
			expect( result.arr[ 1 ] ).toBe( target.arr[ 1 ] );
			expect( result ).toStrictEqual( {
				foo: "g",
				arr: [
					17,
					{ bak: "17" },
				]
			} );
		} );

		it( "should handle larger source array", ( ) =>
		{
			const target = [
				42,
				{ bak: "17" },
			];
			const source = [
				17,
				{ bak: "17" },
				"foo",
			];
			const result = instead( target, source as any );
			expect( result ).not.toBe( target );
			expect( result ).not.toBe( source );
			expect( result[ 1 ] ).toBe( target[ 1 ] );
			expect( result ).toStrictEqual( [
				17,
				{ bak: "17" },
				"foo",
			] );
		} );

		it( "should handle smaller source array", ( ) =>
		{
			const target = [
				42,
				{ bak: "17" },
				"foo",
			];
			const source = [
				17,
				{ bak: "17" },
			];
			const result = instead( target, source as any );
			expect( result ).not.toBe( target );
			expect( result ).not.toBe( source );
			expect( result[ 1 ] ).toBe( target[ 1 ] );
			expect( result ).toStrictEqual( [
				17,
				{ bak: "17" },
			] );
		} );

		it( "should keep entire top-level object", ( ) =>
		{
			const target = {
				foo: "f",
				bar: {
					arr: [ false, { foo: "bar" } ],
					bak: "17",
				},
				newtype: false,
			};
			const source = {
				foo: "f",
				bar: {
					arr: [ false, { foo: "bar" } ],
					bak: "17",
				},
				newtype: false,
			};
			const result = instead( target, source as any );
			expect( result ).toBe( target );
		} );

		it( "should keep entire top-level array", ( ) =>
		{
			const target = [
				"foo",
				{
					foo: "f",
					bar: {
						arr: [ false, { foo: "bar" } ],
						bak: "17",
					},
					newtype: false,
				},
			];
			const source = [
				"foo",
				{
					foo: "f",
					bar: {
						arr: [ false, { foo: "bar" } ],
						bak: "17",
					},
					newtype: false,
				},
			];

			const result = instead( target, source as any );
			expect( result ).toBe( target );
		} );
	} );
} );
