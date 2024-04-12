class User {
    constructor(firstName, lastName, email, password, gdpr, createdAt, role) {
        this.firstName = firstName
        this.lastName = lastName
        this.email = email
        this.password = password
        this.gdpr = gdpr
        this.createdAt = createdAt
        this.role = role
    }
}

module.exports = { User }
