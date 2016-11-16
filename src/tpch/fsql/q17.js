//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query17(noasm){
  return ABi.select()
    .from("@lineitem","@part")
    .field(as(div(sum("@l_extendedprice"),7.0),"avg_yearly"))
    .where(eq("@p_partkey","@l_partkey"),
           eq("@p_brand",'Brand#23'),
           eq("@p_container",'MED BOX'),
           lt("@l_quantity",ABi.select()
                               .from("@lineitem")
                               .field(mul(0.2,(avg("@l_quantity"))))
                               .where(eq("@l_partkey","@p_partkey"))))
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  module.exports=query17;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
