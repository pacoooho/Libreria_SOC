 
let timer = (new Date()).getTime();


console.log( `timer  ${timer}` ); 
 ////////////////////////////////////////////////////////////////////////////////////////////////////////

milisegundos = (funcion) => {// FUNCIÓN GENERAL
    let millis =  (new Date()).getTime();
    console.log( `${funcion} ${millis-timer} milisegundos` );
}
 ////////////////////////////////////////////////////////////////////////////////////////////////////////

 let jsonData = {};
datosPredefinidos = () => {// FUNCIÓN GENERAL 
    jsonData.listaCompra = [];//  DATOS LISTA CESTA DE COMPRA 
       
    jsonData.compra = [];// DATOS LISTA CESTA DE COMPRA 
    jsonData.inicio = {
        ultimaBusqueda: "harry potter",// harry potter lista de temas que han interesado
        startIndex: 0,
        maxResults: 18,
    };
    
    guardarDatos();
};

guardarDatos = () => {  // FUNCIÓN GENERAL
    localStorage.setItem( `jsonData` , JSON.stringify(jsonData) ); // guardamos
   
   jsonData = JSON.parse( localStorage.getItem( `jsonData` ) );    // returns
}
 ////////////////////////////////////////////////////////////////////////////////////////////////////////
 request = obj => {// FUNCIÓN GENERAL
    return new Promise( ( resolve, reject ) => {
        let xhr = new XMLHttpRequest();
        xhr.open( obj.method || `GET`, obj.url );
        if ( obj.headers ) {
            Object.keys( obj.headers ).forEach(key => {
                xhr.setRequestHeader(key, obj.headers[key]);
            });
        }
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve( xhr.response );
/*                 console.log(`xhr.response  ` + xhr.response);
 */            } else {
                reject( xhr.statusText );
            }
         milisegundos(`final request`);
        };
        xhr.onerror = () => reject( xhr.statusText );
        xhr.send( obj.body );
      });
};

 ////////////////////////////////////////////////////////////////////////////////////////////////////////

replaceString = ( viejoS, nuevoS, Texto ) => { // FUNCIÓN GENERAL 
    return Texto.split( viejoS ).join( nuevoS);
};

 ////////////////////////////////////////////////////////////////////////////////////////////////////////



cargaArticulo = (busquedas,articulo,libreria) => {// FUNCIÓN INICI Y LLIBRES
    let img = busquedas.volumeInfo.imageLinks;
    if ( img ){
        let tamaño = busquedas.volumeInfo.imageLinks.medium;
         //   console.log(`sss `+tamaño);
        if (tamaño == undefined) tamaño = busquedas.volumeInfo.imageLinks.smallThumbnail;
            img = tamaño;
    }
    else { img = `assets/images/senseportadap.jpg`;
    }   

    let title = busquedas.volumeInfo.title;
    if (title){
        if ( title.length > 70){ title = `${title.substring(0,70)}...`;}
    } else {title = `sense títol`} 

    let author = busquedas.volumeInfo.authors;
    let id = 'detall.html?'+  busquedas.id;
    let text =
        `<article  class="llibre"> 
           <figure ">
                <a href="${id}">
                    <img  src="${img}" alt="portada llibre" tabindex="${articulo+1}">
                </a>
                <figcaption>
                    <a  href="${id}">
                      <h3>${title}</h3>
                      </a>
                </figcaption>
            </figure>
            <address class="autor">
            </address>
        </article>` ;
        libreria.innerHTML += text ; 

    if (author){
        if ( author.length > 0){ /////AUTORES
            for ( recorreautor in author ){
                let lineaAutor = document.createElement(`li`);
                lineaAutor.style = `font-size: 14px;`;
                if ( recorreautor >= 3 ) {
                    lineaAutor.innerHTML = `...i altres autors`;
                    lineaAutor.style.listStyleType = `none`;
                } else {lineaAutor.innerHTML = author[recorreautor];}
                lineaAutor.style.margin = `0px 0px 0px 15px`;
                libreria.children[articulo].querySelector(`address`).appendChild(lineaAutor);
                if ( recorreautor == 2 ) {break;}
            } 
        }  
    } else { libreria.children[articulo].querySelector(`address`).innerHTML = `Anonin`} 
}
 ////////////////////////////////////////////////////////////////////////////////////////////////////////
cargaLibrosCesta = (compra) => {// FUNCIÓN CISTELLA
    let datos = document.querySelector(`tbody`);
    console.log( datos.childElementCount );
    let lineas = datos.childElementCount;
    for ( let d=0; d < lineas; d++){
        let linea = datos.children[0];
        datos.removeChild(linea);
    }
    let totalCompra = 0;
    for ( let recorreCompra=0; recorreCompra < compra.length; recorreCompra++){
        console.log( compra );
         // Línea de datos
        let tr = document.createElement(`tr`);
            // Dato de línea
            let td = document.createElement(`td`);
                /// boton eliminar compra
                let botonEliminarCompra=document.createElement(`img`);
                    botonEliminarCompra.style.width = `20px`;
                    botonEliminarCompra.style.height = `20px`;
                    botonEliminarCompra.src = `assets/images/error.png`;
                    td.dataset.title = `x`;
                   /*  td.className=`llibre-remove`; */
                    botonEliminarCompra.addEventListener( `click` ,function() {
                         //
                         let noLista=1;
                      for (recorreLista2 in jsonData.listaCompra){
                          if (jsonData.listaCompra[recorreLista2].libro.id==jsonData.compra[recorreCompra].libro.id
                            && jsonData.listaCompra[recorreLista2].cantidad==jsonData.compra[recorreCompra].cantidad
                            && jsonData.listaCompra[recorreLista2].selecionado!=false){
                            jsonData.listaCompra[recorreLista2].selecionado=false;
                            console.log("title  "+jsonData.listaCompra[recorreLista2].libro.volumeInfo.title);
                                noLista=0;
                            break;
                          }
                      }
                      if(noLista) {jsonData.listaCompra.unshift( jsonData.compra[recorreCompra] );
                         jsonData.listaCompra[0].selecionado=false;}
                      jsonData.compra.splice( recorreCompra,1 );
                      guardarDatos();
                       //jsonData.listaCompra[0].selecionado=false;
/*                         datos.removeChild(datos.children[recorreCompra]);
 */                        console.log( `recorreCompra ${recorreCompra}` );
                        console.log( `click botonEliminarCompra` );
                        cargaLibrosCesta( jsonData.compra );
                        cargaLibrosLista( jsonData.listaCompra );   

                    });
            td.appendChild( botonEliminarCompra );
        tr.appendChild( td );

            let td2 = document.createElement(`td`);
            // imagen portada
            let portada=document.createElement(`img`);
                portada.style.width=`50px`;
                portada.style.height=`75px`;
                portada.src = compra[recorreCompra].libro.volumeInfo.imageLinks.smallThumbnail;
                portada.className=`llibre-img`; 

                td2.appendChild( portada );
                tr.appendChild( td2 );

            let td3 = document.createElement(`td`);
                // dato nombre libro
                let titulo = document.createTextNode(compra[recorreCompra].libro.volumeInfo.title);
                td3.dataset.title = `Llibre`;
                /* td3.className=`llibre-name`; */
            td3.appendChild(titulo);
        tr.appendChild(td3);

            let td4 = document.createElement(`td`);
                // dato precio libro
                let precio = document.createTextNode(`${compra[recorreCompra].libro.saleInfo.listPrice.amount}€`);
                td4.dataset.title = `Preu`;
            td4.appendChild(precio);
        tr.appendChild(td4);

            let td5 = document.createElement( `td` );
                // dato precio libro
                let cantidad = document.createTextNode(compra[recorreCompra].cantidad);
                td5.dataset.title = `Qt`;
            td5.appendChild( cantidad );
        tr.appendChild( td5 );

            let td6 = document.createElement(`td`);
        // dato subtotal libro
                let totalNum = compra[recorreCompra].cantidad*compra[recorreCompra].libro.saleInfo.listPrice.amount;
                let total = document.createTextNode(`${totalNum.toFixed(2)}€`);
                td6.dataset.title = `Total`;
                td6.className = `llibre-import`;
            td6.appendChild( total );
        tr.appendChild( td6 );

        datos.appendChild( tr );
        totalCompra += totalNum;
        console.log( `total ${totalCompra}` );
    }
    /*     totalCompra=totalCompra.toFixed(2);
     */console.log( `totalCompra ${totalCompra}` );
    let totalCompraTabla = document.querySelector( `tfoot tr td` );
    totalCompraTabla.innerHTML = `${totalCompra.toFixed(2)}€`;
    console.log( `totalCompraTabla  ${totalCompraTabla.innerHTML}` );
}

cargaLibrosLista = (listaCompra) => {// FUNCIÓN CISTELLA
    let lista = document.querySelector( `.listaCompra` );

    console.log( lista.childElementCount );
    let lineas = lista.childElementCount;
    for (let d=0;d < lineas; d++){
        let linea = lista.children[0];
        lista.removeChild(linea);
    }
    for (let recorreLista = 0;recorreLista < listaCompra.length; recorreLista++){
        let linea = document.createElement(`li`);
            linea.style.marginLeft = `20px`;

            let botoneliminar = document.createElement(`img`);
                botoneliminar.style.width = `20px`;
                botoneliminar.style.height = `20px`;
                botoneliminar.src = `assets/images/error.png`;
                botoneliminar.addEventListener(`click`, function() {
                    jsonData.listaCompra.splice( recorreLista,1 );
                    guardarDatos();
                    cargaLibrosLista( jsonData.listaCompra );  
                    console.log( `click botoneliminar` );
                });
 
            linea.appendChild( botoneliminar );
            let texto = document.createTextNode(`
                ${textoCaracter(listaCompra[recorreLista].libro.volumeInfo.title,40)} Preu: 
                ${listaCompra[recorreLista].libro.saleInfo.listPrice.amount} | Qt: 
                ${listaCompra[recorreLista].cantidad}`);
            linea.appendChild( texto );

            let botonaceptar = document.createElement( `img` );
                botonaceptar.style.width = `20px`;
                botonaceptar.style.height = `20px`;
                botonaceptar.src = `assets/images/ok.png`;
 
            if (listaCompra[recorreLista].selecionado==false){
                botonaceptar.addEventListener(`click`, function() {//Añade libro ha cesta
               jsonData.compra.unshift( listaCompra[recorreLista] );// 
/*                     jsonData.listaCompra.splice( recorreLista,1 );
 */             
                    jsonData.listaCompra[recorreLista].selecionado=true;
                 guardarDatos();
                    document.querySelector( `.listaCompra` ).removeChild( lista.children[recorreLista] );
                    cargaLibrosCesta( jsonData.compra );
                    cargaLibrosLista( jsonData.listaCompra );  
                   
                    console.log( `click botonaceptar` );
                });
            }else {linea.style.textDecoration= `line-through`; 
        }
            linea.appendChild( botonaceptar );
            linea.style.margin = `0 0 0 20px`;
        lista.appendChild( linea );
    }
}