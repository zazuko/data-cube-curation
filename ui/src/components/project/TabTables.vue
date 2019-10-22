<template>
  <div class="output-tables">
    <b-field>
      <b-button type="is-primary" icon-left="plus">
        Add table
      </b-button>
    </b-field>

    <section class="tables-list">
      <article class="card" v-for="(table, index) in tables" :key="index">
        <header class="card-header" :style="{'background-color': table.color}">
          <h3 class="card-header-title">{{ table.name }}</h3>
        </header>
        <section class="card-content">
          <table class="table">
            <tbody>
              <tr v-for="(property, index) in table.properties" :key="index">
                <th>{{ property.name }}</th>
                <td>{{ property.type }}</td>
              </tr>
            </tbody>
          </table>
        </section>
        <footer class="card-footer">
          <div class="buttons has-addons">
            <b-button icon-left="pencil"></b-button>
            <b-button icon-left="trash-can-outline"></b-button>
          </div>
        </footer>
      </article>
    </section>
  </div>
</template>

<style>
  .tables-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
  }

  .tables-list > .card {
    margin-right: 1rem;
    margin-bottom: 1rem;
  }

  .tables-list > .card > .card-content {
    padding: 0;
  }

  .tables-list > .card > .card-footer {
    display: flex;
    justify-content: flex-end;
  }

  .tables-list > .card > .card-footer > .buttons > .button {
    border: none;
    border-radius: 0;
  }
</style>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class TabTables extends Vue {
  @Prop() tables;
}
</script>
