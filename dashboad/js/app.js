/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



$(document).ready(function () {

    (function () {

        const config = {
            apiKey: "AIzaSyBkXMnzwwIdLiL3wlwhwxbOjohfRCxnYQY",
            authDomain: "deliverybot-7c1ae.firebaseapp.com ",
            databaseURL: "https://deliverybot-7c1ae.firebaseio.com",
            storageBucket: "deliverybot-7c1ae.appspot.com"
        };
        firebase.initializeApp(config);

       /* const auth = firebase.auth(); //@YSHamashia
        const promesa = auth.signInWithEmailAndPassword('', '');
        promesa.catch(e => console.log(e.message));

        firebase.auth().onAuthStateChanged(firebaseUser => {

            if (firebaseUser) {
                console.log('entre');
                console.log(firebaseUser);
            } else {
                console.log('not logged in');
            }
        });*/

        // get elements
        // create referents 
        const dbRefePedidos = firebase.database().ref();
        const dbRefDetalle = dbRefePedidos.child("pedidos").orderByChild('fecha');

        // -------------------------------------------------
        // Controller
        // -------------------------------------------------
        const userApp = {
            init: function () {
                this.selectedUserName = null;
                userListView.init();
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

        // -------------------------------------------------
        // View
        // -------------------------------------------------
        let userListView = {
            init: function () {
                console.log('incio tabla');
                this.render();
            },
            clickListItem: function (name) {
                return function () {
                    userApp.setuserName(name);
                    userDetailView.doEntregado();
                };
            },
            render: function () {
                // CHILD_ADDED EVENT
                dbRefDetalle.on("child_added", snap => {
                    console.log('la data agregada');
                    compareData(snap, this);

                }).bind(this);

                // CHILD_CHANGED EVENT
                dbRefDetalle.on('child_changed', snap => {
                    console.log('la data cambiada');
                    compareData(snap, this);
                });

                // CHILD_REMOVE EVENT
                dbRefDetalle.on('child_removed', snap => {
                    userListView.render();
                });
            }
        };

        function compareData(data, t) {

            items = data.val();
            var nuevo = false;
            var fileDelete;

            $('#pTable > tbody  > tr').each(function (tr) {
                if (this.cells[0].innerHTML === data.key && items.entregado.toString().toUpperCase() === 'SI') { // ID data                    
                    nuevo = true;
                    fileDelete = tr;
                }
            });

            if (nuevo === true) {
                var row = document.getElementById(data.key);
                row.parentNode.remove(row);

                return;
            }

            getAllData(data, t);
        }

        function getAllData(snap, t) {

            var table = $('#pTable tbody');
            data = snap.val();

            //console.log(data.entregado.toString().toUpperCase());

            if (data.entregado.toString().toUpperCase() === 'NO') {

                var tr = document.createElement('tr');

                var tdID = document.createElement('td');
                var tdOrden = document.createElement('td');
                var tdnombre = document.createElement('td');
                var tdtelefono = document.createElement('td');
                var tddireccion = document.createElement('td');
                var tdmonto = document.createElement('td');
                var tdentregado = document.createElement('td');
                var tdfecha = document.createElement('td');
                var tdadicional = document.createElement('td');

                var tdaction = document.createElement('td');
                var btn = document.createElement("BUTTON");

                tdID.innerText = snap.key;
                $(tdID).attr('id', snap.key);
                $(tdID).hide();

                tdOrden.innerText = data.orden;

                tdnombre.innerText = data.nombre;
                tdtelefono.innerText = data.telefono;

                tddireccion.innerText = data.direccion;
                tdmonto.innerText = data.monto;

                tdentregado.innerText = data.entregado;

                //tdfecha.innerText = data.fecha;
                tdfecha.innerText = $.datepicker.formatDate('dd-mm-yy', new Date(data.fecha));
                tdadicional.innerText = data.adicional;

                btn.innerHTML = "Entregado";
                btn.addEventListener("click", t.clickListItem(snap.key));

                tdaction.appendChild(btn);
                tr.appendChild(tdID);
                tr.appendChild(tdOrden);
                tr.appendChild(tdnombre);
                tr.appendChild(tdtelefono);
                tr.appendChild(tddireccion);
                tr.appendChild(tdmonto);
                tr.appendChild(tdentregado);
                tr.appendChild(tdfecha);
                tr.appendChild(tdadicional);
                tr.appendChild(tdaction);

                table.append(tr);

            }
        }

        let userDetailView = {
            init: function () {
                //this.doEntregar();
            },
            doEntregado: function () {

                let getUserName = userApp.getUserName();
                let userDetailRef = userApp.getUserInfoDBRef();
                userDetailRef.update({entregado: "si"});
            }
        };
        userApp.init();

    }());

});
