class Listing {
    constructor(
        userId,
        title,
        description,
        image,
        participant,
        maxParticipant,
        eventDate
    ) {
        this.userId = userId
        this.title = title
        this.description = description
        this.image = image
        this.participant = participant
        this.maxParticipant = maxParticipant
        this.eventDate = eventDate
    }
}
module.exports = { Listing }
