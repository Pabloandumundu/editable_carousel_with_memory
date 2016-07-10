var t, actual;

function select(i){
	actual = i;

	$("nav a")
		.removeClass("on off")
		.addClass(function(j){return(j===i)?"on":"off";});

	$("#persona").html(galeria[i].persona);
	$("#frase").html(galeria[i].frase);
	$("#foto").attr("src", galeria[i].foto);

	clearTimeout(t);
	t = setTimeout( function(){select((i + 1) % galeria.length);}, 2000);
}

function generar_selector(){ // regenerate selector buttons
	var selector = $("#selector");

	selector.html("");
	
	galeria.forEach(function(elem,i) {
		selector.append("<li><a onClick='select("+i+")'></a></li>");
	});
}

$(function (){
	localStorage.gale = localStorage.gale || JSON.stringify(galeriaorig);
	galeria = JSON.parse(localStorage.gale);
	generar_selector();

	$("#restaurar").on("click", function(){
		$("#datos").css("display", "none");
		clearInterval(t);
		// t = undefined;
		$( "#dialog-confirm" ).dialog({
  			resizable: false,
  			position: { my: 'top', at: 'top+50' },
  			width:550,
  			height:160,
  			modal: true,
  			buttons: {
    			"Restaurar citas": function() {
      				localStorage.gale = JSON.stringify(galeriaorig);
					galeria = JSON.parse(localStorage.gale);
					generar_selector();
					$( this ).dialog( "close" );
					i = actual;
      				t = setInterval( function(){select((i + 1) % galeria.length);}, 2000);
      				setInterval(t);
      				select(actual);
    			},
    			Cancel: function() {
      				$( this ).dialog( "close" );
      				i = actual;
      				t = setInterval( function(){select((i + 1) % galeria.length);}, 2000);
      				setInterval(t);
      				select(actual);
    			}
  			}	
		});
	});

	$("#editar").on("click", function(){
		clearTimeout(t);
		if($('#datos').css('display') == 'block') {
			$("#datos").css("display", "none");
			$('#flecha').attr('src', 'images/carat-d-white.svg');
			i = actual;
      		t = setInterval( function(){select((i + 1) % galeria.length);}, 2000);
      		setInterval(t);
			return;
		};
		if($('#datos').css('display') == 'none') {
			$("#persona_d").html(galeria[actual].persona);
			$("#frase_d").html(galeria[actual].frase);
			$("#foto_d").html(galeria[actual].foto);
			$('#flecha').attr('src', 'images/carat-d-whiteinv.svg');
			$("#datos").css("display", "block");
		};
	});

	// add new citation
	$("#nuevo").on("click", function(){
		$("#datos").css("display", "none");

		actual = galeria.push({
			 persona:$("#persona_d").html(),
			 frase:$("#frase_d").html(),
			 foto:$("#foto_d").html()
		}) - 1;
		generar_selector();
		localStorage.gale = JSON.stringify(galeria);
		select(actual);
		$('#flecha').attr('src', 'images/carat-d-white.svg');
	});

	// edit citations
	$("#guardar").on("click", function(){
		$("#datos").css("display", "none");

		galeria[actual].persona = $("#persona_d").html();
		galeria[actual].frase = $("#frase_d").html();
		galeria[actual].foto = $("#foto_d").html();      
		generar_selector();
		localStorage.gale = JSON.stringify(galeria);
		select(actual);
		$('#flecha').attr('src', 'images/carat-d-white.svg');
	});
	
	// delete citations
	$("#borrar").on("click", function(){
		$("#datos").css("display", "none");
		if (galeria.length>1) {
						galeria.splice(actual, 1);
		} 
		else
		{
					galeria[actual].persona = "";
					galeria[actual].frase = "añade tu cita...";
					galeria[actual].foto = "";
		}
		generar_selector();
		localStorage.gale = JSON.stringify(galeria);
		select(0);
		$('#flecha').attr('src', 'images/carat-d-white.svg');
	});
	
	select(0);
});