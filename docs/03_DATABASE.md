# Database PyroRescue

Gunakan MySQL atau MariaDB. phpMyAdmin hanya digunakan untuk melihat dan mengelola database.

Nama database yang disarankan:

```text
pyrorescue_db
```

## Tabel utama

```text
users
levels
challenges
user_level_progress
challenge_attempts
```

## `levels`

Kolom:

```text
id
level_number
title
material
learning_objective
is_active
created_at
updated_at
```

Contoh data:

```text
1 | Tepi Sungai Terbakar | variable
2 | Hutan Gambut Berasap | loop
3 | Suaka Bekantan | if_else
```

## `challenges`

Kolom:

```text
id
level_id
order_number
title
instruction
concept
starter_code
expected_data
hint_1
hint_2
created_at
updated_at
```

`expected_data` memakai JSON sederhana.

Level 1:

```json
{
  "water": 3,
  "must_use_variable": true
}
```

Level 2:

```json
{
  "spray_count": 3,
  "must_use_loop": true
}
```

Level 3:

```json
{
  "condition": "besar",
  "must_use_if": true
}
```

## `user_level_progress`

Kolom:

```text
id
user_id
level_id
status
completed_at
created_at
updated_at
```

Status:

```text
locked
unlocked
completed
```

## `challenge_attempts`

Digunakan untuk assessment sederhana.

Kolom:

```text
id
user_id
challenge_id
submitted_code
syntax_valid
concept_valid
mission_success
created_at
```

## Relasi

```text
Level hasMany Challenge
Level hasMany UserLevelProgress

Challenge belongsTo Level

UserLevelProgress belongsTo User
UserLevelProgress belongsTo Level

ChallengeAttempt belongsTo User
ChallengeAttempt belongsTo Challenge
```

## Kenapa sederhana?

Karena game hanya memiliki tiga level. Jangan membuat inventory, shop, leaderboard, atau sistem achievement kompleks jika belum diperlukan.
