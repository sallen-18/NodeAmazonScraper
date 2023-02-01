const axios = require("axios");
const cheerio = require("cheerio");
const Sentiment = require("sentiment");

// const userAgentList = [
//     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36',
//     'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
//     'Mozilla/4.0 (compatible; MSIE 9.0; Windows NT 6.1)',
//     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36 Edg/87.0.664.75',
//     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.18363',
// ]
const fetchReviews = async (asin, pageNo) => {
    const reviews = [];
    for (let i = 1; i < pageNo; i++) {
        console.log(`getting page ${i}`)
        // const randomUserAgent = userAgentList[Math.floor(Math.random()*userAgentList.length)];
        // const options = {
        //     headers: {
        //         'User-Agent': randomUserAgent,
        //       }
        //     }
        try {
            let url = `https://www.amazon.co.uk/product-reviews/${asin}/ref=cm_cr_arp_d_paging_btm_next_2?ie=UTF8&reviewerType=all_reviews&pageNumber=${i}`
            const response = await axios.get(`https://www.amazon.co.uk/product-reviews/${asin}/ref=cm_cr_arp_d_paging_btm_next_2?ie=UTF8&reviewerType=all_reviews&pageNumber=${i}`);
            // const response = await axios.get(`https://www.amazon.co.uk/echo-dot-5th-gen-2022-release-with-clock/product-reviews/${asin}/ref=cm_cr_arp_d_paging_btm_next_2?ie=UTF8&reviewerType=all_reviews&pageNumber=${i}`,options);
            await new Promise(resolve => setTimeout(resolve, 2000));
            const html = response.data;
            const $ = cheerio.load(html);
                $('div[data-hook="review"]').each((_idx, el) => {
                const review = $(el)
                const title = review.find('a[data-hook="review-title"]:first').text().trim()
                const rating = review.find('i[data-hook=review-star-rating] span:first').text().trim()
                const body = review.find('span[data-hook=review-body] span:first').text().trim()
                
                const data = {
                    'title':title,
                    'rating':rating,
                    'body':body
                } 
                console.log(`review found on page ${url} `)
                reviews.push(data)
            });
            
            
        } catch (error) {
            throw error;
        }
        
    }
    console.log("done")
    if (reviews){return JSON.stringify(reviews);}
};

const getAsin = (url) =>{
    return url.match("/([a-zA-Z0-9]{10})(?:[/?]|$)")[1]
}

// fetchReviews(asin, pageNo).then((reviews) => console.log(reviews));

const formatResults = async (results) =>{

    var positive =0;
    var neutral=0;
    var negative=0;
    var overall=0;

    for(let x in results){

        score = results[x].score

        if(score > 0){
            positive++;
        }
        else if(score < 0 ){
            negative++;
        }
        else{
            neutral++;
        }
        overall += score;        
    }

    const resultData = {
        'positive':positive,
        'neutral':neutral,
        'negative':negative,
        'totalReviews':positive+negative+neutral,
        'overallValue':overall
    }

    const pieData = [
        {name:"positive", value:positive },
        {name:"neutral", value:neutral },
        {name:"negative", value:negative },
    ]

    return pieData
}


const sentimentAnalysis = async (url) =>{

    var sentiment = new Sentiment();

    var pageNo = 20
    asin = getAsin(url)
    var reviews = await fetchReviews(asin, pageNo)
    var data = JSON.parse(reviews)
    
    var sentimentResults = []

    for(let x in data){
        sentimentResults.push(sentiment.analyze(data[x].body))
    }

    resultData = formatResults(sentimentResults)

    return resultData
}

module.exports ={
    sentimentAnalysis, formatResults, fetchReviews
}

