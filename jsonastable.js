(function(){

  function findColumns(json){return  _.reduce(json, function(memo, v){return _.union(memo, _.isPlainObject(v)?_.keys(v):[])},[]);}

  function gen(json){
    if (_.isPlainObject(json)) return genObject(json);
    if (_.isArray(json)) return genArray(json);
    return String(json)
  }

  function genObject(json){
    return _.map(json, function(v,k){
      return {tag:"tr", children:
        _.isPlainObject(v)?
        {tag:"td", children:{tag:"table",children: [{tag:"caption",children:k}, {tag:"tbody", children:gen(v)}]}}
        :(_.isArray(v)&&findColumns(v).length)?
        {tag:"td", children:{tag:"table",children: [{tag:"caption",children:k}].concat(gen(v))}}
        :[{tag:"th", children:k}].concat({tag:"td", children:gen(v)})
      }
    })
  }

  function genArray(json){
    var columns = findColumns(json);
    if (columns.length) return {tag:"td", children:{tag:"table", children:
      [{tag:"tr", children:_.map(columns, function(column){return {tag:"th", children:column}})}]
      .concat(_.map(json, function(row){
        return {tag:"tr", children:_.map(row,function(col){return {tag:"td", children:gen(col)}})}
      }))
    }}
    return {tag:"ol", children:_.map(json, function(v){ return {tag:"li", children: gen(v)}})}
  }

  function root (json){
    return {tag:"table", attrs:{class:"table"}, children:gen(json)}
  }

  window.jsonastable = function(json){
    return root(json)
  };

})();
