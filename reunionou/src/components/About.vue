<template>
  <NavBar />

    <div class="container">
      <h1>À propos</h1>
      <p>
        Le projet proposé consiste en une application web basée sur un backend exposant une ou plusieurs API RESTful,
        exploitée par une ou plusieurs WebApps et une application mobile, offrant des services aux utilisateurs.
      </p>
      <h2>Modules</h2>
      <ul class="list-unstyled">
        <li>
          <strong>Backend:</strong> exposant une API REST et exploitant des données. L'API est implantée en Node.js, et est réalisé dans un environnement basé sur des conteneurs Docker/Docker Compose.
        </li>
        <li>
          <strong>WebApp:</strong> exploitant l'API du backend et offrant des services aux utilisateurs. Cette WebApp est
          implantée dans le navigateur en JavaScript / Vue.js, et peut être servie par un conteneur Docker séparé ou à
          l'extérieur de l'environnement Docker. La mise en forme des parties front-end se fait en utilisant Bootstrap 5.
        </li>
        <li>
          <strong>Application mobile:</strong> exploitant une API du backend, produite avec Flutter.
        </li>
      </ul>
      <h2>Contraintes</h2>
      <ul class="list-unstyled">
        <li>
          Le backend et la gestion des données associées est réalisé dans un environnement basé sur des conteneurs
          Docker/Docker Compose.
        </li>
        <li>
          La WebApp peut être servie par un conteneur Docker séparé ou à l'extérieur de l'environnement Docker.
        </li>
        <li>
          La mise en forme des parties front-end se fait en utilisant Bootstrap 5 en version SCSS.
        </li>
      </ul>
      <h2>Notre groupe</h2>
      <ul class="list-unstyled">
        <li>
          Blanchard Loïc  - Bourlon Erwan
        </li>
        <li>
          Jarosz Léa - Leblanc Lilian
        </li>
      </ul>
    </div>
    <Footer />
  </template>
  
  <script>
  import NavBar from './NavBar.vue';
  import Footer from './Footer.vue';
  export default {
    name: 'AboutPage',
    components: { NavBar, Footer },
  }
  </script>
