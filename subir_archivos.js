var http=require('http');
var url=require('url');
var fs=require('fs');
var formidable=require('formidable');

var mime = {
   'html':'text/html',
};

var servidor=http.createServer(function(pedido,respuesta){
    var objetourl = url.parse(pedido.url);
    var camino='public'+objetourl.pathname;
    if (camino=='public/')
        camino='public/index.html';
    encaminar(pedido,respuesta,camino);
});


servidor.listen(4330, '127.0.0.1');


function encaminar (pedido,respuesta,camino) {

    switch (camino) {
        case 'public/subir':{
            subir(pedido,respuesta);
            break;
        }
        case 'public/listadofotos':{
            listar(respuesta);
            break;
        }
        default:{
            fs.exists(camino,function(existe){
                if (existe) {
                    fs.readFile(camino,function(error,contenido){
                        if (error) {
                            respuesta.writeHead(500, {'Content-Type':'text/plain'});
                            respuesta.write('Error interno');
                            respuesta.end();
                        } else {
                            var vec = camino.split('.');
                            var extension=vec[vec.length-1];
                            var mimearchivo=mime[extension];
                            respuesta.writeHead(200, {'Content-Type':mimearchivo});
                            respuesta.write(contenido);
                            respuesta.end();
                        }
                    });
                } else {
                    respuesta.writeHead(404, {'Content-Type':'text/html'});
                    respuesta.write('<!doctype html><html><head></head><body>Recurso inexistente</body></html>');
                    respuesta.end();
                }
            });
        }
    }
}


function subir(pedido,respuesta)
{

    var entrada=new formidable.IncomingForm();
    var salida="";
    var ruta = "";
    entrada.uploadDir='upload';
    entrada.parse(pedido);
    entrada.on('fileBegin', function(field, file){
        //file.path = "/home/ilus/Desktop/JS/subir_archivos/public/upload/"+file.name;
        file.path = "C:/Users/Bakazakura/Desktop/formidable/public/upload/"+file.name;
        ruta=file.path;
    });
    entrada .on('end', function(){
        var exec =require('child_process').exec;
//        var child=exec('java -jar /home/ilus/Desktop/JS/subir_archivos/public/jars/obtener_fecha.jar   ' +ruta,
        var child=exec('java -jar C:/Users/Bakazakura/Desktop/formidable/public/jars/obtener_fecha.jar ' +ruta,

        
        function(error,stdout,stderr){

           console.log(ruta+"\n"+stdout);
           salida=stdout;
           respuesta.writeHead(200, {'Content-Type':'text/html'});
            respuesta.write('<!doctype html><html><head></head><body background="https://storge.pic2.me/cm/2880x1800/125/minimal_40.jpg">'+'<b Style="font-family:Arial; font-size:xx-large; color:white;">Archivo Subido</b><br><a href="index.html"><button id="bntArchivos" Style="font-family:Arial;  font-size:xx-large">'+'Regresar</button></a><br><b><div>'+salida+'</div></br><br></body></html>');
             respuesta.end();
            if (error!=null) {
                console.log("Error->"+error);
            }
        }).exec;
        module.exports=child;

        
       
    });
}

function listar(respuesta) {
  fs.readdir('C:/Users/Bakazakura/Desktop/formidable/public/upload/',function (error,archivos){
      var fotos='';
      for(var x=0;x<archivos.length;x++) {
          fotos += '<img src="upload/'+archivos[x]+'"><br>';
      }
      respuesta.writeHead(200, {'Content-Type':'text/html'});
      respuesta.write('<!doctype html><html><head></head><body>'+
      fotos+
      '<a href="index.html">Regresar</a></body></html>');
      respuesta.end();
  });
}

console.log('Servidor web iniciado');
