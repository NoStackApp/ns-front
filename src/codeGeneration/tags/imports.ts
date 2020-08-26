import {formTypes, nodeTypes} from '../../constants'

const Handlebars = require('handlebars')
const H = require('just-handlebars-helpers');

H.registerHelpers(Handlebars);
/*
import styled{{#if (neq boilerPlateInfo.nodeType '${nodeTypes.ROOT}') }}, { keyframes }{{/if}} from 'styled-components';
 */

export const imports = Handlebars.compile(`

// ns__start_section {{tempDetails}} imports
{{#if (eq boilerPlateInfo.formType '${formTypes.CREATION}') }}
import React, { useState } from 'react';
import { graphql } from '@apollo/react-hoc';
import styled from 'styled-components';
import { EXECUTE } from '@nostack/no-stack';
import compose from '@shopify/react-compose';

import PropTypes from 'prop-types';

import { CREATE_{{typeSpecifier}}_ACTION_ID{{actionIdsForSingleChildren}}{{typeIdsForSingleChildren}} } from '../../../config';
{{/if}}
  {{#if (eq boilerPlateInfo.formType '${formTypes.LIST}') }}
import React, { Component, createRef } from 'react';
{{#if (eq boilerPlateInfo.nodeType '${nodeTypes.ROOT}') }}
import { Unit } from '@nostack/no-stack';
{{/if}}
import styled from 'styled-components';
import { v4 } from 'uuid';
{{#if (eq boilerPlateInfo.nodeType '${nodeTypes.ROOT}') }}
import { flattenData } from '../../../flattenData';
{{/if}}

import {{names.singular}}CreationForm from '../{{names.singular}}CreationForm';
import {{names.singular}} from '../{{names.singular}}';
{{#if (eq boilerPlateInfo.nodeType '${nodeTypes.ROOT}') }}

import { {{names.source.constant}} } from '../../../config';
import {
  {{names.source.relationships}},
  {{names.source.query}},
} from '../../source-props/{{names.source.name}}';
{{/if}}
{{/if}}
{{#if (eq boilerPlateInfo.formType '${formTypes.SINGLE_INSTANCE}') }}
import React, { useState } from 'react';
import styled from 'styled-components';
import { EXECUTE } from '@nostack/no-stack';
import compose from '@shopify/react-compose';
import { graphql } from '@apollo/react-hoc';

import PropTypes from 'prop-types';
import {
  UPDATE_{{typeSpecifier}}_ACTION_ID,
  DELETE_{{typeSpecifier}}_ACTION_ID{{childrenTypeList}},
} from '../../../config';

import EditInstanceForm from '../../EditInstanceForm';
import DeleteInstanceMenu from '../../DeleteInstanceMenu';

{{{childrenImportList}}}
{{/if}}
// ns__custom_start {{tempDetails}} addedImports
// <!-- prettier-ignore-start -->
// <!-- prettier-ignore-end -->
// ns__custom_end {{tempDetails}} addedImports
// ns__end_section {{tempDetails}} imports
`)

