// Trefle requires JWT tokens to avoid exposing keys. These routes take a
// trefle token from the front end and use it in order to display searces on the front end.

const axios = require("axios");

const API = {

    getAllPlants: function (usertoken) {
        return axios.get('https://trefle.io/api/v1/plants?token=' + usertoken)
    },

    searchPlant: function (query, usertoken, page) {
        return axios.get('https://trefle.io/api/v1/plants/search?token=' + usertoken + '&q=' + query + '&page=' + page)
    },

    searchSlug: function (slug,usertoken) {
        return axios.get('https://trefle.io/api/v1/species/' + slug + '?token=' + usertoken)
    },

    formatSearchResults: function ({ data }) {
        const allData = [];
        data.forEach(element => {
            const dataFormatted = {};
            dataFormatted.common_name = element.common_name;
            dataFormatted.scientific_name = element.scientific_name;
            dataFormatted.image_url = element.image_url;
            dataFormatted.slug = element.slug
            allData.push(dataFormatted)
        })
        return allData;
    },

    fetchToken: async function () {

        const params = {
            origin: 'https://plantit-site.herokuapp.com/',
            // ip: user's api
            token: 'NpbVZNazanTbq6IdZi-WePXi9AGzuqXARezyDNnW2bA'
        }
        return axios({
            method: "post",
            url: "https://trefle.io/api/auth/claim",
            data: params,
        })
    }

}

module.exports = API