var fs = require('fs');
var yaml = require('js-yaml');
var crypto = require('crypto');

var log = require("./Logger");

function getUsers(){
	var users = {};

	try
	{
		var usersFiles = fs.readdirSync(__dirname+"/../config/users");
	}
	catch(e)
	{
		if(e.code == "ENOENT")
		{
			log.error("Le dossier utilisateurs n'existe pas");
		}
		else
		{
			console.trace(e);
		}
		return false;
	}

	for(var i = 0; i<usersFiles.length; i++)
	{
		try
		{
			var username = usersFiles[i].replace(/(.*).yml/,"$1");
			users[username] = yaml.safeLoad(fs.readFileSync(__dirname+"/../config/users/"+usersFiles[i]));
			users[username].username = username;
		}
		catch(e)
		{
			console.trace(e);
		}
	}
	return users;

}

function getInfos(username){
	try
	{
		var user = yaml.safeLoad(fs.readFileSync(__dirname+"/../config/users/"+username+".yml"));
		return user;
	}
	catch(e)
	{
		if(e.code == "ENOENT")
		{
			log.error("Le fichier d'utilisateur pour "+username+" n'existe pas");
		}
		else
		{
			console.trace(e);
		}
		return false;
	}
}

function check(username,password)
{
	try
	{
		fs.accessSync(__dirname+"/../config/users/"+username+".yml");
		var user = getInfos(username);
		if(password == user.password)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	catch(e)
	{
		if(e.code != "ENOENT")
		{
			console.trace(e);
		}
		return false;
	}
}

function hashString(str)
{
	var shahash = crypto.createHash('sha1');
	shahash.update(str);
	var result = shahash.digest('hex');
	return result;
}

function deleteUser(username)
{
	try
	{
		fs.unlinkSync(__dirname+"/../config/users/"+username+".yml");
		return true;
	}
	catch(e)
	{
		if(e.code != "ENOENT")
		{
			console.trace(e);
		}
		else
		{
			log.warn("L'utilisateur "+username+" ne peut pas etre supprimé : Il n'existe pas");
		}
		return false;
	}
}

exports.getUsers = getUsers;
exports.getInfos = getInfos;
exports.hashString = hashString;
exports.deleteUser = deleteUser;
exports.check = check;