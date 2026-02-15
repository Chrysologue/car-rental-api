jest.mock("../models/locationModel", () => ({
    find: jest.fn(),
    findById: jest.fn()
}))

const request = require("supertest")
const express = require("express")
const locationRoutes = require("../routes/locationRoutes")
const Location = require("../models/locationModel")

const app = express()
app.use(express.json())
app.use("/api", locationRoutes)

describe("Location GET routes", function(){
    afterEach(() => {
       jest.clearAllMocks()
    })

    //GET All
    test('GET /api/locations returns all location', async() => {
        Location.find.mockResolvedValue([
            {
                _id: '507f1f77bcf86cd799439011',
                name: 'Test Location',
                address: '123 Street',
                country: 'USA',
                city: 'NY',
                contactNumber: '123456789',
                email: 'test@test.com'
            }
        ])
        const res = await request(app).get("/api/locations");
        expect(res.statusCode).toBe(200)
        expect(res.body[0].name).toBe('Test Location');
    })

    //GET BY ID
    test("/GET /api/locations/:id", async() => {
        const fakeId = "507f1f77bcf86cd799439011"
        Location.findById.mockResolvedValue({
            _id: fakeId,
            name: 'Single Location'
        })
        
        const res = await request(app).get(`/api/locations/${fakeId}`)
        expect(res.statusCode).toBe(200)
        expect(res.body.name).toBe('Single Location')
    })
})