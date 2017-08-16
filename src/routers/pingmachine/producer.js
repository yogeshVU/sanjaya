/**
 * Created by yogesh on 7/19/17.
 */
// producer.js
var zmq = require( 'zmq' )
    , socket = zmq.socket( 'push' )
    , counter = 0;
// bind to an address and port
socket.bind('tcp://0.0.0.0:9998', function( err ){
    if( err ){
        console.log(err.message);
        process.exit(0);
    }
    // send a message every 350 ms
    // setInterval(function(){
    //     socket.send(counter++ );
    // },1);
    socket.send(counter+10)
});