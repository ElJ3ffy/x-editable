/**
 @class arithmetic
 @extends text
 @final
 @example
 <a href="#" id="quantity" data-value="1.00:1.00" data-type="arithmetic" data-pk="867" class="editable">1</a>

 <script>
 $('.editable').editable(
 {
        showbuttons: false,
        clear: false,
        value: {
            quantity: "0",
            quantity_input: "0"
        },
        params: function (params) {
                let data = params.value;
                data.id = params.pk;
                data._method = "POST";
                data._csrfToken = document.forms[0]._csrfToken.value;
                return data;
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
            return this.str2value(html);
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
            var strArr = [];
            var val;
            /*
            this is mainly for parsing value defined in data-value attribute.
            If you will always set value by javascript, no need to overwrite it
            */
            if(typeof str === 'string' ) {
                strArr = str.split(':');
                if(strArr.length > 1) {
                    val = {
                        quantity: strArr[0],
                        quantity_input: strArr[1]
                    };
                } else {
                    val = {
                        quantity: strArr[0],
                        quantity_input: strArr[0]
                    };
                }
            } else {
                val = {
                    quantity: str.quantity,
                    quantity_input: str.quantity_input
                };
            }
            return val;
        },

        /**
         Sets value of input.

        @method value2input(value)
        @param {any} value
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
            var quantityInput = this.$input.filter('[name="quantity_input"]').val();
            var quantityValue = this.evaluateInput(quantityInput);
            var isFloat = /[.]/.test(quantityValue);
            return {
                quantity: (isFloat) ? parseFloat(this.evaluateInput(quantityInput)).toFixed(2) : quantityValue,
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
            var result;
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
        tpl: '<div class="editable-arithmetic"><input type="text" name="quantity_input"><input type="hidden" name="quantity"></div>'
    });
    $.fn.editabletypes.arithmetic = Arithmetic;
}(window.jQuery));
