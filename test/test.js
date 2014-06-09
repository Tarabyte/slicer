module('Slicer');

test('slicing api is defined', function(){
    var jq = $.fn;
    
    equal(typeof jq.sliceVertical, 'function', 'is function');
    equal(typeof jq.sliceHorizontal, 'function', 'is function');
    equal(typeof jq.sliceBoth, 'function', 'is function');
    
});
