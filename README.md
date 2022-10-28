# Insitute of Biodiversity, Animal Health & Comparative Medicine
A website to display up-to-date Covid-19 data across Africa with interactive graphs showcasing recent and long-term trends. 


## Description
The website is updated with recent Covid 19 data every day at 2am, using data from [Our World in Data](https://ourworldindata.org). This data harvester can be found in the database-refresher folder. The harvested data is stored using a ClickHouse database, stored in the clickhouse folder.
- Detailed information of the database setup can be found in the wiki attatched with this project under [Architecture](https://stgit.dcs.gla.ac.uk/team-project-h/2021/cs21/cs21-main/-/wikis/Architecture) 


The website is built using the Django framework, located in the covid_dashboard folder. The website uses SQL queries to extract data from our database to get JSON content to display statistical tables and graphs.
- For developers, we have documented each feature we have built and noteworthy remarks to aid understanding of the project. This can be found in the wiki attatched with this project under [Documented Features](https://stgit.dcs.gla.ac.uk/team-project-h/2021/cs21/cs21-main/-/wikis/Documented-Features)
- Other end-users are expected to access the live website using the URLs at the top of this document. The website has been designed to be intuitive and includes help text on how to interact with each feature. A more in depth user guide can be found in the wiki attatched with this project under [User Guide](https://stgit.dcs.gla.ac.uk/team-project-h/2021/cs21/cs21-main/-/wikis/User-Guide)


The website is deployed using a Hetzner VPS and Kubernetes cluster and scrips located in the deploy folder. 
- Please see the [Deployment](https://stgit.dcs.gla.ac.uk/team-project-h/2021/cs21/cs21-main/-/wikis/Architecture) page in the wiki attatched with this project for detailed information about Deployment.


## Getting Started

### Dependencies
- As a contributing developer you must be using Linux to run the Kubernetes cluster.
- As an end-user, the website is compatible with popular browsers. Note the website is only fully supported for Desktop deployment and graphs may not scale on mobile.

### Installing (for development)
- Python 3.7+, Git, Docker, Minikube and Kubernetes must be installed and added to PATH, then:
```
$ git clone https://stgit.dcs.gla.ac.uk/team-project-h/2021/cs21/cs21-main.git 
```
or 
```
$ git clone git@stgit.dcs.gla.ac.uk:team-project-h/2021/cs21/cs21-main.git
```
- Then install the dependencies:
```
$ cd cs21-main
$ cd covid_dashboard
$ python -m pip install -r requirements.txt --user
```

### Executing (for development)
- Ensure you are in the cs21-main folder
- Now, follow the steps on the [Workflow](https://stgit.dcs.gla.ac.uk/team-project-h/2021/cs21/cs21-main/-/wikis/Workflow) page in the wiki attatched with this project. This provides detailed information on how to run our software as a developer and our conventions for making new commits.


## Contributors
- Finlay Earsman (2450322E@student.gla.ac.uk)
- Ryan Gregson (2469038G@student.gla.ac.uk)
- Rishabh Mathur (2465899M@student.gla.ac.uk)
- Jack Pearce (2452785P@student.gla.ac.uk)
- Walt Adamson (walt.adamson@glasgow.ac.uk)


## License
This project is licensed under the ISC License - see the LICENSE.txt for details.
