import axios from "axios";
import { expect } from "chai";

const BASE_URL = "https://restful-booker.herokuapp.com";

let token;
let bookingId;

describe("Booking API Tests", function () {
  this.timeout(10000);

  it("should create a token", async () => {
    const response = await axios.post(`${BASE_URL}/auth`, {
      username: "admin",
      password: "password123",
    });

    expect(response.status).to.equal(200);
    expect(response.headers["content-type"]).to.match(/application\/json/);
    expect(response.data.token).to.exist;
    token = response.data.token;
  });

  it("should create a booking", async () => {
    const response = await axios.post(
      `${BASE_URL}/booking`,
      {
        firstname: "Jim",
        lastname: "Brown",
        totalprice: 111,
        depositpaid: true,
        bookingdates: {
          checkin: "2018-01-01",
          checkout: "2019-01-01",
        },
        additionalneeds: "Breakfast",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Cookie: `token=${token}`,
        },
      }
    );

    expect(response.status).to.equal(200);
    expect(response.headers["content-type"]).to.match(/application\/json/);
    expect(response.data.bookingid).to.exist;
    expect(response.data.booking.firstname).to.equal("Jim");
    expect(response.data.booking.lastname).to.equal("Brown");
    bookingId = response.data.bookingid;
  });

  it("should get created booking by id", async () => {
    const response = await axios.get(`${BASE_URL}/booking/${bookingId}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Cookie: `token=${token}`,
      },
    });
    expect(response.status).to.equal(200);
    expect(response.headers["content-type"]).to.match(/application\/json/);
    expect(response.data.firstname).to.equal("Jim");
    expect(response.data.lastname).to.equal("Brown");
  });

  it("should update booking", async () => {
    const response = await axios.put(
      `${BASE_URL}/booking/${bookingId}`,
      {
        firstname: "Jane",
        lastname: "Brown",
        totalprice: 111,
        depositpaid: true,
        bookingdates: {
          checkin: "2018-01-01",
          checkout: "2019-01-01",
        },
        additionalneeds: "Breakfast",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Cookie: `token=${token}`,
        },
      }
    );

    expect(response.status).to.equal(200);
    expect(response.headers["content-type"]).to.match(/application\/json/);
    expect(response.data.firstname).to.equal("Jane");
    expect(response.data.lastname).to.equal("Brown");
  });

  it("should remove booking", async () => {
    const response = await axios.delete(`${BASE_URL}/booking/${bookingId}`, {
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${token}`,
      },
    });

    expect(response.status).to.equal(201);
  });
});
