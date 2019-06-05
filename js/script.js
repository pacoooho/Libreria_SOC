 
  //////////////////////FUNCION PRINCIPAL CARGA////////////////////////////////////////////////////////
carga = () => {
    let pagina = document.querySelector(".contenido");

    let paginaVisitada = pagina.getAttribute('data-pagina'); // fruitCount = '12'

    let local = document.querySelector(".buscador .icon-perfil");
    local.addEventListener( "click" , () => {
        console.log("Borra memoria");
        localStorage.clear(); 
        datosPredefinidos();  
      if (paginaVisitada == "cistella" ) { 
        console.log("Cistella");
        cargaLibrosCesta(jsonData.compra);
        cargaLibrosLista(jsonData.listaCompra);
      }
    });

    if ( !localStorage.getItem("jsonData") ){
        console.log("cargando datos predefinidos!!");
        datosPredefinidos();// 
    } else {
        console.log("actualizando datos...!!");
         jsonData = JSON.parse(localStorage.getItem("jsonData"));
    }
   //  setInterval( 'testing()' ,500 );
        
   
    console.log( paginaVisitada);
    if (paginaVisitada === "detall" ){ detall(); }
    if (paginaVisitada === "inici" ){ inici(); }
    if (paginaVisitada === "llibres" ){ llibres(); }
    if (paginaVisitada === "cistella" ){ cistella(); }
    milisegundos("final carga");
 
 
};

testing = ( n = false )=> {
    let aCollection = document.getElementsByTagName( 'a' );
    console.log(aCollection);
    /*     // Mostramos enlaces por consola de toda la página
    let aCollection = document.getElementsByTagName( 'a' );
    console.log(aCollection);
    for( let a = 0; a < aCollection.length; a++ ){
       (function(a){
        aCollection[ a ].addEventListener( 'mouseover', function(e){
          e.preventDefault();
          console.log( `a-> ${a} | href-> ${aCollection[a].href}`);

        }, 'false' );
      })( a );
    }// fín mostrar enlaces */
}
/////////////////////////////////////////////////
inici = () => {
    console.log("//////////////Enlace página///////////");
    let url = document.location;
    console.log(`enlace completo:`);
    console.log(document.location);
    console.log(`path:`);
    console.log(document.location.pathname);
    console.log("//////////////Enlace página///////////");

    let peticion4Busquedas=`https://www.googleapis.com/books/v1/volumes?q=&orderBy=relevance&startIndex=4&maxResults=4&filter=paid-ebooks&printType=books&key=AIzaSyC21UNGXbHByC6avyzsenuEKYu0pPNN5sM`;
    let ultimaBusqueda = `q=${ jsonData.inicio.ultimaBusqueda}`;
    ultimaBusqueda=replaceString( ` `,`+`,ultimaBusqueda );
    console.log( `ultimaBusqueda ${ultimaBusqueda}` );
    console.log( `screen.width ${screen.width}` );

    peticion4Busquedas = replaceString( `q=`,ultimaBusqueda,peticion4Busquedas);
    console.log(peticion4Busquedas);
    request( {url: peticion4Busquedas} ).then(data => {    
        let busquedas4 = JSON.parse(data);
        console.log(busquedas4);
        prueba=JSON.parse(data);
        console.log(busquedas4.items.length);
        console.log(`totalItems ${busquedas4.totalItems}`);
        let libreria = document.getElementById(`libreria4`);///// librería de libros
        console.log(libreria);
        for (let recorreArticulo = 0; recorreArticulo<busquedas4.items.length;recorreArticulo++){
            cargaArticulo( busquedas4.items[recorreArticulo],recorreArticulo,libreria );
       ////////////////////MediaQuerys JS/ INICIO///////////////////////
         widthPantallaActual=screen.width;
        let img = libreria.children[recorreArticulo].querySelector(`figure a img`);
        if ( widthPantallaActual<576 ) {
/*             console.log(`<576`);
 */            img.style.width=`100%`;
            img.style.height=`100%`;
        }
        else  if ( widthPantallaActual>576 && widthPantallaActual<992 ){
/*             console.log(`>576<992`);
 */            img.style.width=`230px`;
            img.style.height=`345px`;
        }
        else if ( widthPantallaActual>992 ){
/*                console.log(`>992`);
 */               img.style.width=`220px`;
               img.style.height=`320px`;
        }    
       
    }// fin del for
    testing();  
    let mesLlegits = document.querySelector(`.mes-llegits ul li ol`);
    let cambioColor = 0;
    mesLlegits.children[2].addEventListener(`click`, () => {
        if ( cambioColor%2 == 0 ){mesLlegits.children[2].style.color = `blue`;}
        else { mesLlegits.children[2].style.color = `red`;}
        cambioColor++;
        });
    });

    milisegundos(`final inici`);

   
};// fin inici

function formAction() {
    console.log(`formAction`);

}
///////////////////////////LLIBRES/////////////////////////////////////////
 llibres = () => {
    
    console.log("//////////////Enlace página///////////");
    let url = document.location;
    console.log(`enlace completo:`);
    console.log(document.location);
    console.log(`path:`);
    console.log(document.location.pathname);
    console.log("//////////////FIN Enlace página///////////");

    console.log(`llibres`);
    console.log(jsonData.inicio.maxResults);

    console.log(window.location.search);
    let startIndex = 0, maxResults = 0;
    let peticion18Busquedas =/* orderBy= newest | relevance*/ /* filter=paid-ebooks&printType=books& */
    'https://www.googleapis.com/books/v1/volumes?XXX&orderBy=relevance&key=AIzaSyC21UNGXbHByC6avyzsenuEKYu0pPNN5sM';
    let urlParametros = new URLSearchParams(window.location.search);
    // comprueba las 3 posibles entradas de datos para la búsqueda de la página y actua rellenando 
    //la busqueda en consequecia

    // COMPRUEBA PARÁMETROS PARA API
    if ( urlParametros.has('q') ) {
        let bus =urlParametros.get('q');
        if ( bus.length > 0 ){ console.log(`tenemos busqueda`); // guardamos busqueda en local
            jsonData.inicio.ultimaBusqueda = bus;
            jsonData.inicio.startIndex = 0;
            jsonData.inicio.maxResults = 18;
            guardarDatos();  
        }
        else { console.log(`Busqueda vacía : `);// cargamos predefinida de local y sino libros
            urlParametros.delete( 'q' );
            urlParametros.append( 'q',jsonData.inicio.ultimaBusqueda);
            urlParametros.append( 'startIndex' , jsonData.inicio.startIndex);
            urlParametros.append( 'maxResults' , jsonData.inicio.maxResults);
        }
    } 
    else { // cargar foto si no hay predefinida en local///////////////////////////////////////
        console.log(`menu!!`);// cargamos predefinida de local por 
        urlParametros.append( 'q', jsonData.inicio.ultimaBusqueda );
        urlParametros.append( 'startIndex', jsonData.inicio.startIndex );
        urlParametros.append( 'maxResults', jsonData.inicio.maxResults );
    }
    //
    if ( !urlParametros.has( 'startIndex' ) )    {
        startIndex = 0;
        urlParametros.append( 'startIndex', 0 );
    } else { startIndex=urlParametros.get( 'startIndex' );}
    //
    if ( !urlParametros.has('maxResults') )    {
        urlParametros.append('maxResults', 18);
        maxResults=18;
    } else { maxResults=urlParametros.get('maxResults'); }

        // FIN COMPRUEBA PARÁMETROS PARA API



// PETICIÓN
    console.log( `busqueda : ${urlParametros}` );
    peticion18Busquedas = replaceString( `XXX`,urlParametros,peticion18Busquedas );
    console.log( `peticion18Busquedas ${peticion18Busquedas}` );
    request( {url: peticion18Busquedas} ).then(data => {    
        let busquedas18 = JSON.parse(data);
        console.log( busquedas18);

        if ( busquedas18.items.length > 0 ){// Si tenemos resultados
            let libreria = document.querySelector(`.libreria18`); 

            // eliminamos artículos de la plantilla
            let lineas = libreria.childElementCount;
            for ( let d = 0; d < lineas; d++){
              let linea = libreria.children[0];
              libreria.removeChild( linea );   
            }   


            document.querySelector( `.busquedas18` ).style.display= `block`;
            // mostramos cantidad de resultados de la busqueda
            let mensaje = document.createTextNode(`Libres trobats  per : `+
            replaceString( `+`,` `,jsonData.inicio.ultimaBusqueda )+
            ` (`+busquedas18.totalItems+`)`);
            let resultadoBusqueda = document.querySelector(`.busquedas18 .resultadoBusqueda`);
            resultadoBusqueda.appendChild( mensaje );

            // Damos URLS a los botones de avance/retroceso libreria y mostramos indice
            let retrocesoLibreria =  document.querySelector(`.navegadorResultados`).children[0];
            let urlParametrosRetroceso = new URLSearchParams();
                urlParametrosRetroceso.append( `q`,jsonData.inicio.ultimaBusqueda );
            let startIndexRetroceso=Number( startIndex ) -18;
            if ( startIndexRetroceso < 0 ){
                retrocesoLibreria.style.display = `none`;
                startIndexRetroceso = 0; startIndex = 0;
            }
            urlParametrosRetroceso.append( `startIndex`,startIndexRetroceso );
            urlParametrosRetroceso.append( `maxResults` ,18);
            retrocesoLibreria.href = `llibres.html`+`?`+ urlParametrosRetroceso;
            // Damos valores a startIndex y maxResults para navegar por todos los resultados
            let avanceLibreria =  document.querySelector(`.navegadorResultados`).children[2];
            let urlParametrosAvance = new URLSearchParams();
                urlParametrosAvance.append( `q`,jsonData.inicio.ultimaBusqueda );
            let maxResul = 0;
            let startIndexAvance = Number( startIndex ) + 18;
            if ( startIndexAvance > busquedas18.totalItems){
                maxResults = 18;
                maxResul = Number( startIndex ) + Number( maxResults );
                avanceLibreria.style.display= `none`;
            } else if ( (startIndexAvance + 18 ) > busquedas18.totalItems ){// final de libreria
                maxResults = ( busquedas18.totalItems-startIndexAvance );
            } 
            urlParametrosAvance.append( `startIndex`,startIndexAvance );
            urlParametrosAvance.append( `maxResults`,maxResults );
            avanceLibreria.href = `llibres.html?${urlParametrosAvance}`;
            jsonData.inicio.maxResults = maxResults;
            jsonData.inicio.startIndex = startIndex;
            guardarDatos();
            let mensajeIndice = document.querySelector(`.navegadorResultados`).children[1];            
            if ( maxResults != 18){ maxResul = Number(startIndex ) +18;}
            else { maxResul = Number(startIndex ) + Number( maxResults );}
            mensajeIndice.innerHTML = `${startIndex} a ${maxResul} de ${busquedas18.totalItems}`;
            let mensaje2  = document.createTextNode(mensajeIndice);
            mensajeIndice.appendChild(mensaje2);

            // Mostarmos las búsquedas devueltas
            for ( let recorreArticulo = 0; recorreArticulo < busquedas18.items.length; recorreArticulo++){

                cargaArticulo( busquedas18.items[recorreArticulo],recorreArticulo,libreria);
                ////////////////////MediaQuerys JS/ INICIO COPIA EN testing(true);///////////////////////
                widthPantallaActual = screen.width;
                let img = libreria.children[recorreArticulo].querySelector(`figure a img`);
/*                 console.log(img.innerHTML);
 */
                if (widthPantallaActual <= 576 ) {
/*                     console.log(`<576`);
 */                 img.style.width=`100%`;
                    img.style.height=`100%`;
                }
                else if (widthPantallaActual > 576 && widthPantallaActual <= 768) {
/*                     console.log(`>576<768`);
 */                 img.style.width=`250px`;
                    img.style.height=`375px`;
                }
                else if ( widthPantallaActual > 768 && widthPantallaActual < 992){
/*                     console.log(`>576<992`);
 */                 img.style.width=`180px`;
                    img.style.height=`270px`;
                }
                else  if ( widthPantallaActual > 992){
/*                         console.log(`>992`);
 */                 img.style.width=`150px`;
                    img.style.height=`225px`;
                }       
            
                ////// FIN 
            }// fin del for

            testing();
        }
        else {console.log(`noooo!! no hay libros`);
        }

    }).catch(error => {
        console.log(`ERROR!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`); console.log(error);
        let mensajeError = document.querySelector(`main h1`);
        mensajeError.innerHTML=`Prova amb una altra cerca`;
        console.log(mensajeError.outerHTML);
    });
    // PETICIÓN
  
   /*  testing(true); */
};

/////////////////////////DETALL/////////////////////////////////////////////////
detall = () => {
    console.log("/////////////Enlace página///////////");
    let url = document.location;
    console.log(`enlace completo:`);
    console.log(document.location);
    console.log(`path:`);
    console.log(document.location.pathname);
    console.log("//////////////Enlace página///////////");


    console.log( `detall` );
    console.log( window.location.search );
    // Recupera parámetros
    let peticion1Busqueda = `https://www.googleapis.com/books/v1/volumes/XXX?key=AIzaSyC21UNGXbHByC6avyzsenuEKYu0pPNN5sM`;
    let busqueda = window.location.search;
    busqueda= replaceString( `?`,``,busqueda );
    peticion1Busqueda = replaceString( `XXX`,busqueda,peticion1Busqueda );
    console.log( `peticion1Busqueda ` + peticion1Busqueda);
    // PETICIÓN
    request( {url: peticion1Busqueda} ).then(data => {    
        let busquedas1 = JSON.parse(data);
        console.log( busquedas1 );
        console.log( busquedas1.length );
        console.log( 'id  '+busquedas1.id );
        let article = document.querySelector(`.llibre-detall`);
 
        // Desplega resultados búsqueda y muestra elementos según los resultados 
        let tamaño=`medium`;// extraLarge  medium 
        let img = article.querySelector(`figure img`);
         if ( busquedas1.volumeInfo.imageLinks){
           if ( busquedas1.volumeInfo.imageLinks[tamaño] ) {
                img.src=busquedas1.volumeInfo.imageLinks[tamaño];
            } else  { img.src=busquedas1.volumeInfo.imageLinks.thumbnail;
            }
        } else { img.src= `assets/images/senseportadap.jpg`;
        }
        //
        let title = busquedas1.volumeInfo.title;
/*         if ( title.length>70){ title=title.substring(0,70)+`...`;}
 */        article.querySelector(`div h1`).innerHTML = title;
        let autor = busquedas1.volumeInfo.authors;
        if (autor){
            let autores= busquedas1.volumeInfo.authors.length;
            for (recorreautor in autor){
                let texto=``;
                if (recorreautor!=autores-1) { texto=document.createTextNode(`${autor[recorreautor]}, `);}
                else { texto=document.createTextNode( `${autor[recorreautor]}.` );}
                article.querySelector(`.detall-llibre-autor`).appendChild(texto);
            }
        }
        let description = busquedas1.volumeInfo.description;
        if ( description ){
            article.querySelector(`.resum`).innerHTML = description;
        }
        let radios = article.querySelector( `.tipus-llibre` );
        radios.children[0].style.display = `none`;// oculto radio
        radios.children[2].style.display = `none`;// oculto radio
        let infoRadio = radios.children[1].children[1];

        let venta=busquedas1.saleInfo.saleability;
        let botonCistella = article.querySelector(`.wrap-btns`).children[0];
        let botonReserva = article.querySelector(`.wrap-btns`).children[1];
        let comptador = article.querySelector(`.submit-cantidad`);
        
        let cantidad = 1;
        comptador.children[1].value = cantidad;

        /* botonReserva.removeAttribute(`disabled`) ;
        botonCistella.setAttribute(`disabled`, `disabled`) ; */
                console.log(venta);

        if ( venta == "FOR_SALE"){// Si está a la venta
            infoRadio.children[0].style.display = `none`;// oculto toba
            infoRadio.children[1].innerHTML = `${busquedas1.saleInfo.listPrice.amount} ${busquedas1.saleInfo.listPrice.currencyCode}`;
            infoRadio.children[2].innerHTML = `Disponible`;
            botonCistella.removeAttribute(`disabled`);
            botonReserva.setAttribute(`disabled`, `disabled`);
            let mas = article.querySelector(`.mas`);
            let menos = article.querySelector(`.menos`);
            mas.addEventListener(`click`, () => {
                if (cantidad < 20){ cantidad++;
                    comptador.children[1].value = cantidad;
                }
            }); 
            menos.addEventListener( `click`, () => {
                if (cantidad > 1){ cantidad--;
                    comptador.children[1].value = cantidad;
                }
            }); 
            botonCistella.addEventListener(`click`, () => {
                jsonData.listaCompra.unshift({cantidad:cantidad,libro:busquedas1,selecionado:false});
                console.log(jsonData.listaCompra[0].id);
                console.log(jsonData.listaCompra[0].cantidad);
                guardarDatos();
            });
        }
         else if ( venta === "NOT_FOR_SALE"  ){
             console.log("no sale ");
             infoRadio.children[0].style.display = `none`;// oculto toba
             infoRadio.children[1].innerHTML = ``;
            infoRadio.children[2].innerHTML = `No disponible`;
            botonCistella.setAttribute(`disabled`, `disabled`);
            botonReserva.removeAttribute(`disabled`);
            comptador.children[0].setAttribute(`disabled`, `disabled`);
            comptador.children[1].setAttribute(`disabled`, `disabled`);
            comptador.children[2].setAttribute(`disabled`, `disabled`);
            console.log("no sale ");
        }
         else if ( venta === "FREE"){
            console.log("FREE ");
             article.querySelector(`.resum`).innerHTML = `
            <a href="https://play.google.com/books/reader?id=${busquedas1.id}&hl=es&pg=GBS.PP1">Gratis aquí</a>`;
            infoRadio.children[0].style.display = `block`; 
            infoRadio.children[0].innerHTML = `EBOOK`;
               infoRadio.children[1].innerHTML = `FREE`;
               
            infoRadio.children[2].innerHTML = `Disponible`;
            botonCistella.setAttribute(`disabled`, `disabled`);
            botonReserva.setAttribute(`disabled`, `disabled`);
            
            comptador.children[0].setAttribute(`disabled`, `disabled`);
            comptador.children[1].setAttribute(`disabled`, `disabled`);
            comptador.children[2].setAttribute(`disabled`, `disabled`);
        }
        article.querySelector(`form`).style.display=`block`;

    });
    testing();
};
    ////////////////////////////////////////////////////////////////////
cistella = () => {
    console.log("//////////////Enlace página//////////");
    let url = document.location;
    console.log(`enlace completo:`);
    console.log(document.location);
    console.log(`path:`);
    console.log(document.location.pathname);
    console.log("/////////////Enlace página3///////////");


    console.log( `Lista compra` );
    console.log(  jsonData.listaCompra);
    let lista = document.querySelector(`.listaCompra`);
    console.log(`compra cistella`);
    console.log(jsonData.compra);
           // Eliminamos lineas de la tabla
    document.querySelector(`main`).style.display = `block`;
    // creamos una lista de compra para poder añadir a la cesta de compra el libro 
            cargaLibrosCesta( jsonData.compra );
       
   
 // funcion que retorna el precio por cantidad y rellena campos de la tabla
            cargaLibrosLista( jsonData.listaCompra );

    testing();
};

     
textoCaracter = (testo,caracteres) => {
    let testo2 = ``;
    console.log(`testo.length` + testo.length);
    if (testo.length > caracteres){
        testo2 = testo.substring(0,caracteres-3) + "..."; }
    else { let espacios = caracteres-testo.length;
        console.log( "espacios " + espacios);
        testo2 +=testo + "_".repeat(espacios) + "|"};
        console.log(testo2);
    return testo2;
};