module.exports = {
  "extends": "next/core-web-vitals",
  "rules": {
    'import/order': [
      'error',
      {
        'groups': [
          'builtin',  // 組み込みモジュール
          'external', // npmでインストールした外部ライブラリ
          'internal', // 自作モジュール
          [
            'parent',
            'sibling',
          ],
          'object',
          'type',
          'index',
        ],
        'newlines-between': 'always', // グループ毎にで改行を入れる
        'pathGroupsExcludedImportTypes': [
          'builtin',
        ],
        'alphabetize': {
          'order': 'asc', // 昇順にソート
          'caseInsensitive': true, // 小文字大文字を区別する
        },
        'pathGroups': [ // 指定した順番にソートされる
          {
            'pattern': 'react**',
            'group': 'external',
            'position': 'before',
          },
          {
            'pattern': 'tamagui',
            'group': 'external',
            'position': 'before',
          },
        ],
      },
    ],
  }
}
