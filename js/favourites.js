import { GithubUser } from "./GithubUser.js"



export class Favourites {
    constructor(root) {
        this.root = document.querySelector(root)

        this.load()
    }

    
    load() {
        this.entries = JSON.parse(localStorage.getItem('@githubFavourites:')) || []
    }

    save() {
        localStorage.setItem('@githubFavourites:', JSON.stringify(this.entries))
    }

    async add(username) {
        try {
            const userExists = this.entries.find(entry => entry.login === username)

            if(userExists) {
                throw new Error('User already exists!')
            }

            const user = await GithubUser.search(username)

            if(user.login === undefined) {
                throw new Error('User not found!')
            }

            this.entries = [user, ...this.entries]
            this.update()
            this.save()

        } catch(error) {
            alert(error.message)
        }
        
    }

    delete(user) {
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

        this.entries = filteredEntries
        this.update()
        this.save()
    }
}



export class FavouritesView extends Favourites {
    constructor(root){
        super(root)

        this.tbody = this.root.querySelector('table tbody')

        this.update()
        this.onadd()
    }


    onadd() {
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input')

            this.add(value)
        }
    }

    update() {
        this.removeAllTr()
        this.emptyMessage()

        this.entries.forEach( user => {
            const row = this.createRow()

           row.querySelector('.user img').src = `https://github.com/${user.login}.png` 
           row.querySelector('.user img').alt = `image of ${user.name}`
           row.querySelector('.user p').textContent = user.name
           row.querySelector('.user a').href = `https://github.com/${user.login}`
           row.querySelector('.user span').textContent = user.login
           row.querySelector('.repositories').textContent = user.public_repos
           row.querySelector('.followers').textContent = user.followers
            
           row.querySelector('.remove').onclick = () => {
            const isConfirmed = confirm('Are you sure you want to delete this row?')

            if(isConfirmed) {
                this.delete(user)
            }
           }

           this.tbody.append(row)
        })
    }

    createRow() {
        const tr = document.createElement('tr')

        tr.innerHTML = `
            <td class="user">
                <img src="https://github.com/maykbrito.png" alt="maybrito github image">
                <a href="https://github.com/maykbrito" target="_blank">
                    <p>Mayk Brito</p>
                    <span>maykbrito</span>
                </a>
                        
            </td>
            <td class="repositories">
                76
            </td>
            <td class="followers">
                9000
            </td>
            <td>
                <button class="remove">Remove</button>
            </td>
        `
        return tr
    }

    removeAllTr() {

        this.tbody.querySelectorAll('tr').forEach((tr) => {
            tr.remove()
        })
    }

    emptyMessage() {
        if (this.entries.length === 0) {
            this.root.querySelector('.empty-container').classList.remove('hide')
          } else {
            this.root.querySelector('.empty-container').classList.add('hide')
          }
        }
    
}