const crypto = require("crypto");

class PodcastIndexAPI {
    constructor(key, secret, basePath) {
        this.key = key;
        this.secret = secret;
        this.basePath = basePath;
    }

    async getFeedsByTerm(term) {
        const { url, headers } = this.requestBuilder("search/byterm", {
            q: term,
        });

        const res = await fetch(url, {
            headers,
        });
        const json = await res.json();
        return json;
    }

    async getFeedByID(id) {
        const { url, headers } = this.requestBuilder("podcasts/byfeedid", {
            id,
        });

        const res = await fetch(url, {
            headers,
        });
        const json = await res.json();
        return json;
    }

    async getEpisodesByFeedID(id) {
        const { url, headers } = this.requestBuilder("episodes/byfeedid", {
            id,
        });

        const res = await fetch(url, {
            headers,
        });
        const json = await res.json();
        return json;
    }

    requestBuilder(endpoint, params) {
        let url = this.basePath + endpoint;

        Object.keys(params).forEach((param, idx) => {
            if (idx == 0) {
                url += "?";
            } else {
                url += "&";
            }

            url += param + "=" + encodeURIComponent(params[param]);
        });

        const timestamp = Math.floor(new Date().getTime() / 1000);
        const authToken = crypto
            .createHash("sha1")
            .update(this.key + this.secret + timestamp)
            .digest("hex");
        const headers = {
            "X-Auth-Key": this.key,
            "X-Auth-Date": timestamp,
            Authorization: authToken,
            "User-Agent": "PodcastJSApp/0.1",
        };

        return { url, headers };
    }
}

module.exports = PodcastIndexAPI;
