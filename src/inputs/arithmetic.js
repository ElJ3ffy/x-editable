/**
@class arithmetic
@extends text
@final
@example
<a href="#" id="quantity" data-type="arithmetic" data-inputField="quantity_input" data-pk="1">666</a>
<input type="text" name="quantity_input">
<input type="number" name="quantity">

<script>
$('.editable').editable(
    {
        showbuttons: false,
        clear: false,
        value: {
            quantity: "0",
            quantity_input: "0"
        },
        display: function(value) {
            if(!value) {
                $(this).empty();
                return;
            }
            var html = $('<div>').text(value.quantity).html();
            $(this).html(html);
        }
    }
);
</script>
**/

(function ($) {
    "use strict";
    var Arithmetic = function (options) {
        this.init('arithmetic', options, Arithmetic.defaults);
    };

    $.fn.editableutils.inherit(Arithmetic, $.fn.editabletypes.text);

    $.extend(Arithmetic.prototype, {
        /**
         Renders input from tpl

         @method render()
         **/
        render: function() {
            this.$input = this.$tpl.find('input');
        },

        value2html: function(value, element) {
            if(!value) {
                $(element).empty();
                return;
            }
            var html = $('<div>').text(value.quantity_input).html();
            $(element).html(html);
        },

        html2value: function(html) {
            return null;
        },

        /**
         Converts value to string.
         It is used in internal comparing (not for sending to server).

         @method value2str(value)
         **/
        value2str: function(value) {
            var str = '';
            if(value) {
                for(var k in value) {
                    str = str + k + ':' + value[k] + ';';
                }
            }
            return str;
        },

        /*
         Converts string to value. Used for reading value from 'data-value' attribute.

         @method str2value(str)
        */
        str2value: function(str) {
            /*
            this is mainly for parsing value defined in data-value attribute.
            If you will always set value by javascript, no need to overwrite it
            */
            return str;
        },

        /**
         Sets value of input.

        @method value2input(value)
        @param {mixed} value
        **/
        value2input: function(value) {
            if(!value) {
                return;
            }
            this.$input.filter('[name="quantity_input"]').val(value.quantity_input);
            this.$input.filter('[name="quantity"]').val(value.quantity);
        },

        /**
         Returns value of input. Value can be object (e.g. datepicker)

        @method input2value()
        **/
        input2value: function() {
            let quantityInput;
            quantityInput = this.$input.filter('[name="quantity_input"]').val();
            return {
                quantity: parseFloat(this.evaluateInput(quantityInput)).toFixed(2),
                quantity_input: quantityInput
            };
        },

        /**
         Activates input: sets focus on the first field.

         @method activate()
         **/
        activate: function() {
            this.$input.filter('[name="quantity_input"]').focus().select();
        },

        evaluateInput: function(input) {
            const isNotNumeric = /[a-zA-Z$&+,:;=?@#|'<>.^*()%!-\/\\]/.test(input);
            const isExpression = /[+-^*()%\/]/.test(input);
            const notValid = /[a-zA-Z$&,:;?@#=|'<>!\\]/.test(input);
            let result;
            if (isNotNumeric && isExpression && !notValid) {
                try {
                    if (typeof(math) === 'object') {
                        result = math.evaluate(input);
                    } else {
                        result = eval(input);
                    }
                } catch (e) {
                    result = "Invalid expression";
                }
            } else {
                result = parseFloat(input);
            }
            return result;
        }
    });
    Arithmetic.defaults = $.extend({}, $.fn.editabletypes.text.defaults, {
        /**
        @property tpl
        **/
        tpl:'<div class="editable-arithmetic">' + 
            '<input type="text" name="quantity_input" class="input-small">' +
            '<input type="hidden" name="quantity">' +
            '</div>'
    });
    $.fn.editabletypes.arithmetic = Arithmetic;
}(window.jQuery));
