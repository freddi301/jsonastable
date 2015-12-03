(function(){

  function findColumns(json){return  _.reduce(json, function(memo, v){return _.union(memo, _.isPlainObject(v)?_.keys(v):[])},[]);}

  var datatable_class = " datatable ";
  var bootstrap_class = " table table-bordered table-condensed ";

  function gen(json, options){
    if (_.isPlainObject(json)) return genObject(json, options);
    if (_.isArray(json)) return genArray(json, options);
    return String(json)
  }

  function genObject(json, options){
    return _.map(json, function(v,k){
      return {tag:"tr", children:
        _.isPlainObject(v)?
        {tag:"td", children:{tag:"table", attrs:{class:options.bootstrap?bootstrap_class:""}, children: [{tag:"caption",children:k}, {tag:"tbody", children:gen(v, options)}]}}
        :(_.isArray(v)&&findColumns(v).length)?
        {tag:"td", children:{tag:"table", attrs:{class:options.bootstrap?bootstrap_class:""}, children: [{tag:"caption",children:k}].concat(gen(v, options))}}
        :[{tag:"th", children:k}].concat({tag:"td", children:gen(v, options)})
      }
    })
  }

  function genArray(json, options){
    var columns = findColumns(json);
    if (columns.length) return {tag:"td", children:{tag:"table", attrs:{class:(options.bootstrap?bootstrap_class:"")+(options.datatable?datatable_class:""), id:String(Math.random())}, children:[
      {tag:"thead", children: {tag:"tr", children:_.map(columns, function(column){return {tag:"th", children:column}})}},
      {tag:"tbody", children: _.map(json, function(row){
        return {tag:"tr", children:_.map(row,function(col){return {tag:"td", children:gen(col, options)}}).concat(_.map(_.range(columns.length-_.keys(row).length),function(){return {tag:"td"}}))}
      })}
    ]
    }}
    return {tag:"ol", children:_.map(json, function(v){ return {tag:"li", children: gen(v, options)}})}
  }

  function root (json, options){
    return {tag:"table", attrs:{class:options.bootstrap?bootstrap_class:""}, children:gen(json, options)}
  }

  window.jsonastable = function(json, options){
    return root(json, options)
  };

})();
