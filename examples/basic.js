var BOSH_SERVICE = 'http://quezx.test:5280/bosh';
var connection = null;

function log(msg, data) {
    var tr = document.createElement('tr');
    var th = document.createElement('th');
    th.setAttribute( "style", "text-align: left; vertical-align: top;" );
    var td;

    th.appendChild( document.createTextNode(msg) );
    tr.appendChild( th );

    if (data) {
        td = document.createElement('td');
        pre = document.createElement('code');
        pre.setAttribute("style", "white-space: pre-wrap;");
        td.appendChild(pre);
        pre.appendChild( document.createTextNode( vkbeautify.xml(data) ) );
        tr.appendChild(td);
    } else {
        th.setAttribute('colspan', '2');
    }

    $('#log').append(tr);
}

function rawInput(data)
{
    log('RECV', data);
}

function rawOutput(data)
{
    log('SENT', data);
}

function sendCustomMessage(to, from, body, field1, field2) {
    var m = $msg({to: to, from: from, type: 'chat'}).c("body").t(body);     
   // custom data
   m.up().c("data", {xmlns: 'my-custom-data-ns', field1: field1, field2: field2});
   connection.send(m);
}

function onConnect(status)
{
    if (status == Strophe.Status.CONNECTING) {
	log('Strophe is connecting.');
    } else if (status == Strophe.Status.CONNFAIL) {
	log('Strophe failed to connect.');
	$('#connect').get(0).value = 'connect';
    } else if (status == Strophe.Status.DISCONNECTING) {
	log('Strophe is disconnecting.');
    } else if (status == Strophe.Status.DISCONNECTED) {
	log('Strophe is disconnected.');
	$('#connect').get(0).value = 'connect';
    } else if (status == Strophe.Status.CONNECTED) {
	log('Strophe is connected.');
	 sendCustomMessage("yatish@quezx.test", "darshit@quezx.test", "Shruti its working", "field1", "field2");
 

    }
}

$(document).ready(function () {
    connection = new Strophe.Connection(BOSH_SERVICE);
    connection.rawInput = rawInput;
    connection.rawOutput = rawOutput;

    

    $('#connect').bind('click', function () {
	var button = $('#connect').get(0);
	if (button.value == 'connect') {
	    button.value = 'disconnect';

	    connection.connect($('#jid').get(0).value,
			       $('#pass').get(0).value,
			       onConnect);
	} else {
	    button.value = 'connect';
	    connection.disconnect();
	}
    });
});

function sendMsg(JID,MSG)
{
    Chat.sendMessage(JID, MSG, "chat");
}
