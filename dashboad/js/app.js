/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function () {
    (function () {
        $('#contenedor').hide();

        var today = new Date();

        function readOnly() {
            document.getElementById('monto').readonly = true;
            document.getElementById('orden').readonly = true;
            document.getElementById('entregado').readonly = true;

        }

        function ResetForm() {
            $(":input").not(":button, :submit, :reset, :hidden").each(function () {
                this.value = this.defaultValue;
            });
        }

        $('form').submit(function (e) {
            e.preventDefault();
            var data = $(this).serializeFormJSON();
            saveData(data);
            ResetForm();
            $("#nombre").focus();

        });


        function createJson(obj) {

            var o = {};
            var a = obj.serializeArray();
            $.each(a, function () {
                if (o[this.name]) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push(this.value || '');
                } else {
                    o[this.name] = this.value || '';
                }
            });
            return o;

        }

        $.fn.serializeFormJSON = function () {

            var o = {};
            var a = this.serializeArray();
            $.each(a, function () {
                if (o[this.name]) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push(this.value || '');
                } else {
                    o[this.name] = this.value || '';
                }
            });
            return o;
        };

        //const auth = firebase.auth();
        //auth.signInWithEmailAndPassword('yonaides@gmail.com', '@YSHamashia');

        //console.log(auth);

        const config = {
            apiKey: "AIzaSyBkXMnzwwIdLiL3wlwhwxbOjohfRCxnYQY",
            authDomain: "deliverybot-7c1ae.firebaseapp.com ",
            databaseURL: "https://deliverybot-7c1ae.firebaseio.com",
            storageBucket: "deliverybot-7c1ae.appspot.com",
            messagingSenderId: "88690840490"
        };
        firebase.initializeApp(config);

        // get elements
        // create referents 
        const dbRefePedidos = firebase.database().ref();
        const dbRefDetalle = dbRefePedidos.child("pedidos");

        function saveData(data) {

            pedido = data;
            /*var pedido = {
             "direccion": "comming soon",
             "entregado": "no",
             "fecha_creacion": "10/06/2017 4:00 pm",
             "monto": "150",
             "nombre_completo": "Rogelio",
             "telefono": "809-777-9658"
             };*/

            userApp.setPedido(pedido);
            console.log(pedido);
            console.log('pedido insertado');

        }

        // -------------------------------------------------
        // Controller
        // -------------------------------------------------
        const userApp = {
            init: function () {
                this.selectedUserName = null;
            },
            setuserName: function (name) {
                this.selectedUserName = name;
            },
            getUserName: function () {
                return this.selectedUserName;
            },
            getUserInfoDBRef: function () {
                return dbRefePedidos.child('pedidos/' + this.getUserName());
            },
            setPedido: function (data) {
                dbRefePedidos.child('pedidos/').push(data);
            }
        };


        function getUrlVars() {

            var vars = {};
            var i = 0;

            var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
                    function (m, key, value) {

                        value = value.toString().split("%20").join(" ");
                        value = value.toString().split("+").join(" ");
                        value = value.toString().split("%3B").join(" ");
                        value = value.toString().split("#").join(" ");
                        value = value.toString().split("%22").join(" ");

                        vars[key] = value;
                        i++;
                    }); 

            if (i <= 0) {
                console.log("vacio");
                return;
            }

            document.getElementById('nombre').setAttribute("value", vars['nom']);
            document.getElementById('direccion').setAttribute("value", vars['dir']);
            document.getElementById('telefono').setAttribute("value", vars['tel']);
            document.getElementById('orden').textContent = vars['ord'];
            document.getElementById('adicional').textContent = vars['adi'];
            document.getElementById('monto').setAttribute("value", vars['mon']);
            document.getElementById('entregado').setAttribute("value", 'NO');
            document.getElementById('fecha').setAttribute("value", today);

            console.log(createJson($("#formulario")));
            saveData(createJson($("#formulario")));
            ResetForm();
            //$("#nombre").focus();


        }

        getUrlVars();
        

    }());


});
