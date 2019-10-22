<template>
  <form action="" class="modal-card">
    <header class="modal-card-head">
      <h3 class="modal-card-title">{{ title }}</h3>
    </header>
    <section class="modal-card-body">
      <b-field label="Name">
        <b-input type="text" :value="table.name" placeholder="" required></b-input>
      </b-field>

      <b-field label="Color">
        <b-input type="text" :value="table.color" placeholder="" required></b-input>
      </b-field>

      <b-field label="Properties">
        <b-table :data="table.properties">
          <template slot-scope="props">
            <b-table-column label="Name">
              <b-input :value="props.row.name" />
            </b-table-column>
            <b-table-column label="Type">
              <b-autocomplete v-model="props.row.type" :data="dataTypes" open-on-focus />
            </b-table-column>
            <b-table-column label="">
              <button class="delete is-medium" @click="deleteProperty(props.index)" />
            </b-table-column>
          </template>
          <template slot="empty">
            No properties
          </template>
          <template slot="footer">
            <b-button icon-left="plus" @click="addProperty">Add property</b-button>
          </template>
        </b-table>
      </b-field>

    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">Cancel</button>
      <button class="button is-primary">Save</button>
    </footer>
  </form>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import { Table } from '../../types';

@Component
export default class TableForm extends Vue {
  @Prop({ default: emptyTable }) readonly table: Table;
  @Prop({ default: [] }) readonly tables: Table[];

  get dataTypes() {
    const basicTypes = [
      'xsd:int',
      'xsd:gYearMonth',
    ];
    const tableTypes = this.tables.map((t) => t.name);

    return basicTypes.concat(tableTypes).sort();
  }

  get title() {
    if (this.table.id) {
      return 'Edit table';
    } else {
      return 'Create table';
    }
  }

  addProperty() {
    this.table.properties.push({
      name: '',
      type: '',
    });
  }

  deleteProperty(index: number) {
    this.table.properties.splice(index, 1);
  }
}

function emptyTable() {
  return {
    id: '',
    name: '',
    color: '',
    properties: [],
  };
}
</script>
