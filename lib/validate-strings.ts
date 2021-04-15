const validate = {
  onWhere: function (str: string): any {
    const tokens = this.tokenize(str);
    
    if (tokens === 'Error') return tokens;
    
    const values: unknown[] = [];
    
    tokens.forEach((token, i) => {
      if (token === 'true') {
        values.push(true);
        tokens[i] = '$';
      }
      if (token === 'false') {
        values.push(false);
        tokens[i] = '$';
      }
      if (token === 'null') {
        values.push(null);
        tokens[i] = '$';
      }
      if (token[0] === "'" && token[token.length - 1] === "'") {
        values.push(token.slice(1, token.length - 1));
        tokens[i] = '$';
      }
      const parsedInt = parseInt(token);
      if (!isNaN(parsedInt)) {
        values.push(parsedInt);
        tokens[i] = '$';
      }
    });
    
    return { tokens, values };
  },
  
  insertParams: function (tokens: string[], currParam: number) {
    tokens.forEach((token, i) => {
      if (token === '$') tokens[i] = `$${currParam++}`;
    });
    return tokens;
  },
  
  columnsTables: function (arr?: string[] | string | null): boolean {
    if (!arr) return true;
    arr = typeof arr === 'string' ? [arr] : arr;
    
    for (const el of arr) {
      if (typeof el !== 'string') return false;
      if (el.includes('"') || el.includes("'") || el.includes('\\u'))
      return false;
    }
    return true;
  },
  
  tokenize: function (str: string) {
    let i = 0;
    const tokens: string[] = [];
    let curr = '';
    let insideString = false;
    let readyForString = true;
    let escapeNextChar = false;
    
    while (i < str.length) {
      const char = str[i];
      
      if (escapeNextChar) {
        escapeNextChar = false;
        curr += char;
        i++;
        continue;
      }
      
      if (char === "'") {
        if (!readyForString) {
          return 'Error';
        }
        if (str[i + 1] === "'") {
          curr += "'";
          i += 2;
          continue;
        }
        curr += char;
        insideString = !insideString;
        if (!insideString) {
          tokens.push(curr);
          readyForString = false;
          curr = '';
        }
        i++;
        continue;
      }
      
      if (insideString) {
        
        if (char === '\\') escapeNextChar = true;
        
        curr += char;
        i++;
        continue;
      }
      
      if ('\\"'.includes(char)) return 'Error';
      
      // comparison string below contains tab character at index 1
      if (' 	=()'.includes(char)) {
        if (curr.length) {
          if ('=('.includes(char)) readyForString = true;
          tokens.push(curr);
          curr = '';
        }
        
        if ('=()'.includes(char)) tokens.push(char);
      } else {
        curr += char;
      }
      i++;
      continue;
    }
    if (insideString) return 'Error';
    if (curr.length) tokens.push(curr);
    
    return tokens;
  },
};

export { validate };
