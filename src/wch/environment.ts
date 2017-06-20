interface Environment {
    base: String
    username: String
    password: String
    tenantId: String
    cookie: String

}

const env: Environment = {
    "username" : "kirribilli@isc4sb.com",
    "password" : "INSERT PASSWORD HERE",
    "tenantId" : "242c3813-1347-46ba-a521-13ccedf307be",
    "base" : "https://my7.digitalexperience.ibm.com/api/242c3813-1347-46ba-a521-13ccedf307be",
    "cookie" : undefined
}


export { env as Environment }