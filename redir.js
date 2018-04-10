const ref = require('ref');
const ffi = require('ffi');
const Struct = require('ref-struct');

const _struct_sockaddr_in = Struct({
  'sin_family': 'short',
  'sin_port'  : 'u_short',
  'in_addr'   : struct_in_addr,
  'sin_zero'  : 'char',
});

const _struct_in_addr = Struct({
  's_addr': 'unsigned long',
});

const struct_sockaddr_in = ref.refType(_struct_sockaddr_in);
const struct_in_addr = ref.refType(_struct_in_addr);

shortString = text => { //Maximum fixed size 20, enough for our needs
	var maxStringLength = 20; 
	var theStringBuffer = new Buffer(maxStringLength);
	theStringBuffer.fill(0); //if you want to initially clear the buffer
	theStringBuffer.write(text, 0, "utf-8"); //if you want to give it an initial value
}

var redir = ffi.Library('./redir', {
  'parse_args': [ 'void', [ 'int', 'char* []' ] ],
  'target_init': [ 'int', [ 'char *', 'int', [ struct_sockaddr_in, "pointer" ]] ],
  'target_connect': [ 'int', [ 'int', [ struct_sockaddr_in, "pointer" ] ] ],
  'client_accept': [ 'int', [ 'int', [ struct_sockaddr_in, "pointer" ] ] ],
  'server_socket': [ 'int', [ 'char *', 'int', 'int' ] ],
});


