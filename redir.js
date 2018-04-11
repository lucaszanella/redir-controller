const ref = require('ref');
const ffi = require('ffi');
const Struct = require('ref-struct');

const struct_in_addr = Struct({
  's_addr': 'ulong',
});

const _struct_sockaddr_in = Struct({
  'sin_family': 'short',
  'sin_port'  : 'ushort',
  'in_addr'   : struct_in_addr,
  'sin_zero'  : 'char',
});

struct_sockaddr_in = ref.refType(_struct_sockaddr_in);

//const struct_sockaddr_in = ref.refType(_struct_sockaddr_in);
//const struct_in_addr = ref.refType(_struct_in_addr);

const shortString = text => { //Maximum fixed size 20, enough for our needs
	const maxStringLength = 20; 
	const theStringBuffer = new Buffer(maxStringLength);
	theStringBuffer.fill(0); //if you want to initially clear the buffer
  theStringBuffer.write(text, 0, "utf-8"); //if you want to give it an initial value
  return theStringBuffer;
}

const redir = ffi.Library('./libredir', {
  //'main'           : [ 'int' , [ 'int', 'char* []' ] ],
  //'parse_args'     : [ 'void', [ 'int', 'char* []' ] ],
  'target_init'    : [ 'int' , [ 'char *', 'int', struct_sockaddr_in ] ],
  'target_connect' : [ 'int' , [ 'int',  struct_sockaddr_in ] ],
  'client_accept'  : [ 'int' , [ 'int',  struct_sockaddr_in ] ],
  'server_socket'  : [ 'int' , [ 'char *', 'int', 'int' ] ],
});

export default redir;

export const shortString;