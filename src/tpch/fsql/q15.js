//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query15(noasm){
  revenue0=ABi.select()
    .from("@lineitem")
    .field(as("@l_suppkey","supplier_no"),as(sum(mul("@l_extendedprice", sub(1, "@l_discount"))),"total_revenue"))
    .where(gte("@l_shipdate",'1996-01-01'),
            lt("@l_shipdate",'1996-04-01'))
    .group("@l_suppkey");
    
  return ABi.select()
    .from("@supplier",revenue0)
    .field("@s_suppkey","@s_name","@s_address","@s_phone","@total_revenue")
    .where(eq("@s_suppkey","@supplier_no"),
           eq("@total_revenue", ABi.select().from(revenue0).field(max("@total_revenue"))))
    .order("@s_suppkey");
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  module.exports=query15;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
