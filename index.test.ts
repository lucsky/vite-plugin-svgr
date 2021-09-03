import { svgrOptionsFromQuery } from '.';

test('empty query', () => {
    expect(svgrOptionsFromQuery('component')).toStrictEqual({});
});

test('single boolean options', () => {
    expect(svgrOptionsFromQuery('component&ref')).toStrictEqual({ ref: true });
    expect(svgrOptionsFromQuery('component&ref=true')).toStrictEqual({ ref: true });
    expect(svgrOptionsFromQuery('component&ref=false')).toStrictEqual({ ref: false });
    expect(() => svgrOptionsFromQuery('component&ref=yes')).toThrow();

    expect(svgrOptionsFromQuery('component&icon')).toStrictEqual({ icon: true });
    expect(svgrOptionsFromQuery('component&icon=true')).toStrictEqual({ icon: true });
    expect(svgrOptionsFromQuery('component&icon=false')).toStrictEqual({ icon: false });
    expect(() => svgrOptionsFromQuery('component&icon=yes')).toThrow();

    expect(svgrOptionsFromQuery('component&svgo')).toStrictEqual({ svgo: true });
    expect(svgrOptionsFromQuery('component&svgo=true')).toStrictEqual({ svgo: true });
    expect(svgrOptionsFromQuery('component&svgo=false')).toStrictEqual({ svgo: false });
    expect(() => svgrOptionsFromQuery('component&svgo=yes')).toThrow();

    expect(svgrOptionsFromQuery('component&memo')).toStrictEqual({ memo: true });
    expect(svgrOptionsFromQuery('component&memo=true')).toStrictEqual({ memo: true });
    expect(svgrOptionsFromQuery('component&memo=false')).toStrictEqual({ memo: false });
    expect(() => svgrOptionsFromQuery('component&memo=yes')).toThrow();

    expect(svgrOptionsFromQuery('component&titleProp')).toStrictEqual({ titleProp: true });
    expect(svgrOptionsFromQuery('component&titleProp=true')).toStrictEqual({ titleProp: true });
    expect(svgrOptionsFromQuery('component&titleProp=false')).toStrictEqual({ titleProp: false });
    expect(() => svgrOptionsFromQuery('component&titleProp=yes')).toThrow();

    expect(svgrOptionsFromQuery('component&dimensions')).toStrictEqual({ dimensions: true });
    expect(svgrOptionsFromQuery('component&dimensions=true')).toStrictEqual({ dimensions: true });
    expect(svgrOptionsFromQuery('component&dimensions=false')).toStrictEqual({ dimensions: false });
    expect(() => svgrOptionsFromQuery('component&dimensions=yes')).toThrow();
});

test('multiple boolean options', () => {
    expect(svgrOptionsFromQuery('component&icon&dimensions')).toStrictEqual({ icon: true, dimensions: true });
    expect(svgrOptionsFromQuery('component&icon=false&dimensions')).toStrictEqual({ icon: false, dimensions: true });
    expect(svgrOptionsFromQuery('component&icon&dimensions=false')).toStrictEqual({ icon: true, dimensions: false });
    expect(svgrOptionsFromQuery('component&icon=false&dimensions=false')).toStrictEqual({
        icon: false,
        dimensions: false
    });
});

test('expandProps option', () => {
    expect(svgrOptionsFromQuery('component&expandProps=start')).toStrictEqual({ expandProps: 'start' });
    expect(svgrOptionsFromQuery('component&expandProps=end')).toStrictEqual({ expandProps: 'end' });
    expect(svgrOptionsFromQuery('component&expandProps=false')).toStrictEqual({ expandProps: false });
    expect(() => svgrOptionsFromQuery('component&expandProps=yes')).toThrow();
    expect(() => svgrOptionsFromQuery('component&expandProps')).toThrow();
});

test('single key/value options', () => {
    expect(() => svgrOptionsFromQuery('component&svgProps')).toThrow();
    expect(() => svgrOptionsFromQuery('component&svgProps=height')).toThrow();
    expect(() => svgrOptionsFromQuery('component&replaceAttrValues')).toThrow();
    expect(() => svgrOptionsFromQuery('component&replaceAttrValues=color')).toThrow();
    expect(svgrOptionsFromQuery('component&svgProps=height:80')).toStrictEqual({ svgProps: { height: '80' } });
    expect(svgrOptionsFromQuery('component&replaceAttrValues=color:white')).toStrictEqual({
        replaceAttrValues: { color: 'white' }
    });
});

test('multiple key/value options', () => {
    expect(svgrOptionsFromQuery('component&svgProps=height:80&svgProps=width:150')).toStrictEqual({
        svgProps: { height: '80', width: '150' }
    });
    expect(
        svgrOptionsFromQuery('component&replaceAttrValues=color:white&replaceAttrValues=viewBox:0 0 20 20')
    ).toStrictEqual({
        replaceAttrValues: { color: 'white', viewBox: '0 0 20 20' }
    });
});

test('multiple mixed options', () => {
    expect(
        svgrOptionsFromQuery(
            'component&icon&dimensions=false&svgProps=height:80&svgProps=width:150&replaceAttrValues=color:white'
        )
    ).toStrictEqual({
        icon: true,
        dimensions: false,
        svgProps: {
            height: '80',
            width: '150'
        },
        replaceAttrValues: {
            color: 'white'
        }
    });
});

test('invalid option', () => {
    expect(() => svgrOptionsFromQuery('component&typescript')).toThrow();
    expect(() => svgrOptionsFromQuery('component&typescript=true')).toThrow();
});
