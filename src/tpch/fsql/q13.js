//////////////////////////////////////////////////////////////////////////////
var inNode=(typeof window == 'undefined' );
if(typeof module == 'undefined'){
  module={};
} else { 
}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function query13(noasm){
  return ABi.select()
   .from(
    ABi.select()
    .from("@customer")
    .ljoin("@orders")
      .on(eq("@c_custkey","@o_custkey"),
          notlike("@o_comment",'%special%requests%'))
    .field("@c_custkey",as(count("@o_orderkey"),"c_count"))
    .group("@c_custkey")
    )
   .field("@c_count",as(count("@*"),"custdist"))
   .group("@c_count")
   .order("-@custdist","-@c_count")
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
if(inNode){
  module.exports=query13;
} else delete module;
//////////////////////////////////////////////////////////////////////////////
