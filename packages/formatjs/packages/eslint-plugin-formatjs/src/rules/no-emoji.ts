import {Rule, Scope} from 'eslint';
import {ImportDeclaration} from 'estree';
import {extractMessages} from '../util';
import emojiRegex from 'emoji-regex';
const EMOJI_REGEX = emojiRegex();

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow camel case placeholders in message',
      category: 'Errors',
      recommended: false,
    },
    fixable: 'code',
  },
  create(context) {
    let importedMacroVars: Scope.Variable[] = [];
    return {
      ImportDeclaration: node => {
        if ((node as ImportDeclaration).source.value === '@formatjs/macro') {
          importedMacroVars = context.getDeclaredVariables(node);
        }
      },
      CallExpression: node => {
        const msgs = extractMessages(node, importedMacroVars);
        if (!msgs.length) {
          return;
        }
        msgs.forEach(msg => {
          if (!msg.defaultMessage) {
            return;
          }
          if (EMOJI_REGEX.test(msg.defaultMessage)) {
            context.report({
              node,
              message: 'Emojis are not allowed',
            });
          }
        });
      },
    };
  },
};

export default rule;
