import ideasApi from "../services/ideasApi";

class IdeaList {
  constructor() {
    this._ideaListEl = document.querySelector("#idea-list");
    this._ideas = [];
    this.getIdeas();

    this._validTags = new Set();
    this._validTags.add("technology");
    this._validTags.add("software");
    this._validTags.add("business");
    this._validTags.add("education");
    this._validTags.add("health");
    this._validTags.add("inventions");
  }

  addEventListeners() {
    this._ideaListEl.addEventListener("click", (e) => {
      if (e.target.classList.contains("fa-times")) {
        // stopPropagation will prevent any parent handlers from being executed stopImmediatePropagation will prevent any parent handlers and also any other handlers from executing
        e.stopImmediatePropagation();
        // dataset.id to get the data-id attribute
        const ideaId = e.target.parentElement.parentElement.dataset.id;
        this.deleteIdea(ideaId);
      }
    });
  }

  async getIdeas() {
    try {
      const res = await ideasApi.getIdeas();
      this._ideas = res.data.data; // with Axios when we make a request the data is in an object called data and we want the data inside it (from backend)
      this.render();
    } catch (error) {
      console.log(error);
    }
  }

  async deleteIdea(ideaId) {
    try {
      // delete from server
      const res = await ideasApi.deleteIdea(ideaId);
      this._ideas.filter((idea) => idea._id !== ideaId);
      this.getIdeas();
    } catch (error) {
      alert("You cannot delete this resource");
    }
  }

  addIdeaToList(idea) {
    this._ideas.push(idea);
    this.render();
  }

  getTagClass(tag) {
    tag = tag.toLowerCase();
    let tagClass = "";
    if (this._validTags.has(tag)) {
      tagClass = `tag-${tag}`;
    } else {
      tagClass = "";
    }
    return tagClass;
  }

  render() {
    this._ideaListEl.innerHTML = this._ideas
      .map((idea) => {
        const tagClass = this.getTagClass(idea.tag);
        const deleteBtn =
          idea.username === localStorage.getItem("username")
            ? `<button class="delete"><i class="fas fa-times"></i></button>
        <h3>`
            : "";

        // mongoDB stores it as _id (data-id)
        return `
        <div class="card" data-id="${idea._id}">
        ${deleteBtn}
          ${idea.text}
        </h3>
        <p class="tag ${tagClass}">${idea.tag.toUpperCase()}</p>
        <p>
          Posted on <span class="date">${idea.date}</span> by
          <span class="author">${idea.username}</span>
        </p>
      </div>
      `;
      })
      .join("");
    this.addEventListeners();
  }
}

export default IdeaList;
