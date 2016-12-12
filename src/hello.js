/**
 * Created by rancongjie on 16/12/11.
 */
function hello() {
  return _.template("hello <%=name%>")({name:"angular"});
}