
module.exports = {

    split: function(urn){
        if (urn.indexOf(':') < 0)
            return false;
        else {
            return ({
                cat : urn.split(":")[0],
                subCats : urn.split(":").slice(1,-1),
                id : urn.split(":")[urn.split(":").length-1]
            });
        }
    },

    check: function(urn){
        if (splited)
            return false;
        else {
            return true;
        }
    },

    create: function(cat, subCats, id){
        var newURN = cat;
        for (var i = 0; i < subCats.length; i++) {
            newURN += ":" + subCats[i];
        }
        newURN += ":" + new Buffer(id).toString('base64');
        return newURN;
    },

    toBase64: function(urn){
        var splited = split(urn);
        if (splited)
            return false;
        else {
            return (splited.cat+":"+splited.subCats+":"+new Buffer(splited.id).toString('base64'));
        }
    }


}
