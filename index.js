var links = [{"name": "Linkedin",
              "url": "https://www.linkedin.com/in/annie-wai-3062a4171/"},
            {"name": "Group Up",
             "url": "https://apwai.github.io/group_up/html_skeletons/login.html"},
            {"name": "SquadUCSD",
            "url": "https://www.youtube.com/watch?v=k4o1xaSpKTU&ab_channel=DomL"}]
var myName = "Annie Wai"
var imgPath = "img/profilepicture.jpg"
var json = JSON.stringify(links)
const staticHost = "https://static-links-page.signalnerve.workers.dev"

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
    const url = new URL(request.url)
    if (url.pathname == "/links") {
        return new Response(json, {
            headers: { "content-type": "application/json;charset=UTF-8" }
        })
    }
    const init = {
      headers: {
        "content-type": "text/html;charset=UTF-8",
      },
    }
    const response = await fetch(staticHost, init)
    const results = await gatherResponse(response)
    const newResponse = new Response(results, init)
    return rewriter.transform(newResponse)
}

async function gatherResponse(response) {
  const { headers } = response
  const contentType = headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    return JSON.stringify(await response.json())
  }
  else if (contentType.includes("application/text")) {
    return await response.text()
  }
  else if (contentType.includes("text/html")) {
    return await response.text()
  }
  else {
    return await response.text()
  }
}

const rewriter = new HTMLRewriter()
  .on("div#links", new LinksTransformer(links))
  .on("h1#name", new AttributeWriterName())
  .on("div#profile", new AttributeRemover("style"))
  .on("img#avatar", new AttributeWriterImage())

class LinksTransformer {
  constructor(links) {
    this.links = links
  }

  async element(element) {
      for (let myLink of this.links) {
          var a = "<a href=" + myLink["url"] + ">" + myLink["name"] + "</a>"
          element.append(a, {html: true})

      }
  }
}

class AttributeWriterName {
    element(element) {
        element.setInnerContent(myName, {html:true})
    }
}

class AttributeWriterImage {
    element(element) {
            element.setAttribute("src", imgPath)
    }
}

class AttributeRemover {
    constructor(attributeName) {
        this.attributeName = attributeName
    }

    async element(element) {
         if (element.hasAttribute(this.attributeName)) {
           element.removeAttribute(this.attributeName)
         }
    }
}
