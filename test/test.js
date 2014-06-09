/*global module, test, equal, ok, $*/
module('Slicer');

test('slicing api is defined', function(){
    var jq = $.fn;
    
    equal(typeof jq.sliceVertical, 'function', 'is function');
    equal(typeof jq.sliceHorizontal, 'function', 'is function');
    equal(typeof jq.sliceBoth, 'function', 'is function');    
});

$(function(){
    var area = function (){
        return $('<div>').appendTo('#qunit-fixture');
    },
        txt = 'S';

    test('sliceVertical default', function(){
        var div = area();
        div.text(txt);

        var result = div.sliceVertical();

        equal(div.html(), '<span class="word"><span class="sliced">S<span class="slice column-2-of-2 slice-2-of-2">S</span><span class="slice column-1-of-2 slice-1-of-2">S</span></span></span>', 'got html'); 
        
        ok(div.hasClass('sliced-2x1'), 'class set');
        
        equal(result, div, 'chainable');
    });
    
    
    
    test('sliceHorizontal default', function(){
        var div = area();
        div.text(txt);

        div.sliceHorizontal();

        equal(div.html(), '<span class="word"><span class="sliced">S<span class="slice row-2-of-2 slice-2-of-2">S</span><span class="slice row-1-of-2 slice-1-of-2">S</span></span></span>', 'got html'); 
        
        ok(div.hasClass('sliced-1x2'), 'class set');
    });
    
    test('sliceBoth default', function(){
        var div = area();
        div.text(txt);

        div.sliceBoth();

        equal(div.html(), '<span class="word"><span class="sliced">S<span class="slice column-2-of-2 row-2-of-2 slice-2-2-of-2x2">S</span><span class="slice column-2-of-2 row-1-of-2 slice-2-1-of-2x2">S</span><span class="slice column-1-of-2 row-2-of-2 slice-1-2-of-2x2">S</span><span class="slice column-1-of-2 row-1-of-2 slice-1-1-of-2x2">S</span></span></span>', 'got html'); 
        
        ok(div.hasClass('sliced-2x2'), 'class set');
    });
    
    test('two words', function(){
        var div = area();
        div.text('Two words!');
        
        equal(div.sliceVertical().find('.word').length, 2, 'got 2 words');
    });
    
    test('spaces are not wrapped', function() {
        var div = area();
        div.text('a b ');
        
        equal(div.sliceHorizontal().find('.sliced').length, 2, '2 symbols were sliced');
    });
    
    test('html entities', function() {
        var div = area();
        
        div.text('<>&');
        
        equal(div.sliceVertical().html(), '<span class="word"><span class="sliced">&lt;<span class="slice column-2-of-2 slice-2-of-2">&lt;</span><span class="slice column-1-of-2 slice-1-of-2">&lt;</span></span><span class="sliced">&gt;<span class="slice column-2-of-2 slice-2-of-2">&gt;</span><span class="slice column-1-of-2 slice-1-of-2">&gt;</span></span><span class="sliced">&amp;<span class="slice column-2-of-2 slice-2-of-2">&amp;</span><span class="slice column-1-of-2 slice-1-of-2">&amp;</span></span></span>', 'entities were escaped');
    });
});

