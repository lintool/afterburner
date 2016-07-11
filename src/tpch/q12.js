
function query12(){
  return ABi.select()
	  .from("lineitem").join("orders").on("l_orderkey","o_orderkey")
	  .field("l_shipmode",
			  as(countif("*",or(eq("o_orderpriority","1-URGENT"),eq("o_orderpriority","2-HIGH"))),"high_line_count"),
			  as(countif("*",and(neq("o_orderpriority","1-URGENT"),neq("o_orderpriority","2-HIGH"))),"high_line_count"))
	  .where(isin("l_shipmode",['MAIL', 'SHIP']),
	          lt("l_commitdate","l_receiptdate"),
              lt("l_shipdate","l_commitdate"),
             gte("l_receiptdate",date('1994-01-01')),
              lt("l_receiptdate",date('1995-01-01')))
	  .group("l_shipmode")
          .order([0]);
}
	  