/**
 * Created by tchapda gabi on 12/06/2015.
 */

sukuApp.factory('RegisterService', ['Strophe',  '$q', function (Strophe, $q){
    var Register = {
	    conn: null
    };
    
    Register.conn = new Strophe.Connection(Strophe.BOSH_SERVICE);

    Register.register = function (user) {
	    console.log(user);
	    var d = $q.defer();
    	if (!Strophe.getNodeFromJid(user.jid)) user.jid += '@'+Strophe.ServerAddr+'/web';
	    var callback = function (status) {
	        if (status === Strophe.Status.REGISTER) {
		        Register.conn.register.fields.username =  Strophe.getNodeFromJid(user.jid);
                Register.conn.register.fields.resource = 'web';
        		Register.conn.register.fields.password = user.pwd;
	        	Register.conn.register.submit();
		        console.log('register');
    	    }else if (status === Strophe.Status.REGISTERED) {
	    	    console.log('registered');
		        Register.conn.authenticate();
		        //Register.connect(user);

    	    }else if (status === Strophe.Status.CONNECTED) {
	        	Register.user = user;
		        d.resolve();
	        }else if (status === Strophe.Status.CONNECTING || status === Strophe.Status.AUTHENTICATING) {

	        }else {
		        var msg;
        		if (status === Strophe.Status.CONFLICT) msg = 'This address is already taken';
	        	else if (status === Strophe.Status.REGIFAIL) msg = 'Registration failed';
		        else if (status === Strophe.Status.NOTACCEPTABLE) msg = 'Fields not acceptable';
		        else msg = 'ERROR';
		    msg += '. Unable to register your account';
		    d.reject({what:10, msg:msg});
	    }
	};
	
	    Register.conn.register.connect(Strophe.ServerAddr, callback);
	    return d.promise;
    };

    Register.connect = function (user) {
	    if (!Strophe.getNodeFromJid(user.jid)) user.jid += '@'+Strophe.ServerAddr+'/web';
	    var d = $q.defer();
	    console.log(user);
	    console.log(Strophe.Status);
	    var callback = function(status) {
            console.log(status);
	        if (status === Strophe.Status.CONNECTED) {
                Register.user = user;
    		    console.log(status, 'connected');
    		    d.resolve();
	    	}else if (status === Strophe.Status.CONNECTING || status === Strophe.Status.AUTHENTICATING) {
		        console.log(status, 'connecting');
    	    }else {
	        	console.log(status);
    		    var msg;
	    	    if (status === Strophe.Status.CONNFAIL) msg = 'Connection Error'; else msg = 'ERROR';
                console.log(status, msg);
		        d.reject({what:11, msg:msg});
	        }

	    };
	    Register.conn.connect(user.jid, user.pwd, callback);
	    return d.promise;
    };

    Register.disconnect = function () {
	    var d = $q.defer();
    	var callback = function(status) {

	        if (status === Strophe.Status.DISCONNECTED) {
		        console.log('disconnected');
		        d.resolve();
	        }else if (status === Strophe.Status.DISCONNECTING){

	        }else {
		        d.reject();
	        }
	    };

	    Register.conn.disconnect(callback);
	    return d.promise;
    };
    return Register;
}]);
