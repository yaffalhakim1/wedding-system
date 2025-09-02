# Logging and Soft Delete Implementation

## 🔒 **Soft Deletes vs Hard Deletes**

All delete operations in this system use **SOFT DELETES** by default:

### ✅ **Soft Delete** (What we implemented)
- Records are marked as deleted with a `deletedAt` timestamp
- Data remains in the database but is hidden from normal queries
- Can be recovered/restored if needed
- Maintains data integrity and relationships
- Audit trail is preserved

### ❌ **Hard Delete** (NOT used)
- Records are permanently removed from the database
- Data is lost forever
- Cannot be recovered
- Breaks relationships and audit trails

## 🏗️ **Implementation Details**

### 1. **Model Configuration**
All models now have:
```typescript
// Sequelize paranoid mode enables soft deletes
paranoid: true,
timestamps: true, // Adds createdAt, updatedAt, deletedAt
```

### 2. **Database Schema**
New migrations add:
- `deleted_at` column to all tables (weddings, rsvps, messages, photos)
- `audit_logs` table for complete audit trail
- Indexes for optimal query performance

### 3. **Soft Delete Behavior**
```javascript
// This is a SOFT delete - record is marked, not removed
await rsvp.destroy(); // Sets deletedAt = current timestamp

// To query only non-deleted records (default behavior)
await Rsvp.findAll(); // Automatically excludes deleted records

// To include deleted records
await Rsvp.findAll({ paranoid: false });

// To find only deleted records
await Rsvp.findAll({ where: { deletedAt: { [Op.not]: null } } });
```

## 📝 **Comprehensive Logging System**

### 1. **Console Logging**
All database operations are logged to console with structured JSON:
```json
{
  "timestamp": "2024-09-02T12:00:00.000Z",
  "level": "INFO",
  "action": "CREATE",
  "resource": "rsvp",
  "resourceId": "uuid",
  "context": {
    "userId": "admin",
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0..."
  },
  "data": {
    "old": null,
    "new": { /* record data */ }
  }
}
```

### 2. **Database Audit Trail**
Every operation is stored in `audit_logs` table:
- **table_name**: Which table was affected
- **record_id**: ID of the affected record
- **action**: CREATE, UPDATE, DELETE, RESTORE
- **old_values**: Data before change (JSON)
- **new_values**: Data after change (JSON)
- **user_type**: 'admin' or 'guest'
- **ip_address**: Client IP address
- **user_agent**: Browser/client info
- **metadata**: Additional context

## 🛡️ **Security Benefits**

### 1. **Data Recovery**
- Accidentally deleted records can be restored
- Admin mistakes don't cause data loss
- System errors can be rolled back

### 2. **Compliance & Auditing**
- Complete audit trail for all operations
- Who did what, when, and from where
- Meets regulatory requirements for data handling

### 3. **Forensic Analysis**
- Investigate security incidents
- Track unauthorized changes
- Monitor system usage patterns

## 🚀 **API Endpoints**

### Admin Delete Endpoints (Soft Delete)
```
DELETE /api/admin/rsvps/:id      - Soft delete RSVP
DELETE /api/admin/messages/:id   - Soft delete message
DELETE /api/admin/photos/:id     - Soft delete photo
```

### Admin Audit Endpoints
```
GET /api/admin/audit-logs        - Get audit trail
  ?limit=100                     - Limit results
  ?offset=0                      - Pagination offset
```

## 📊 **Logging Categories**

### Operation Types
- **[DB_CREATE]** - New record created
- **[DB_UPDATE]** - Record updated
- **[DB_DELETE]** - Record soft deleted
- **[DB_SOFT_DELETE]** - Explicit soft delete
- **[DB_RESTORE]** - Deleted record restored
- **[DB_ACCESS]** - Record accessed/queried
- **[DB_ERROR]** - Database operation failed

### Log Levels
- **INFO** - Normal operations
- **WARN** - Soft deletes (attention needed)
- **ERROR** - Failed operations

## 🔧 **Usage Examples**

### For Developers
```typescript
// Log any database operation
logModelOperation(req, 'UPDATE', 'wedding', weddingId, oldData, newData);

// Create audit trail entry
await AuditLog.createAuditEntry({
  table_name: 'messages',
  record_id: messageId,
  action: 'DELETE',
  old_values: oldData,
  user_type: 'admin',
  ip_address: req.ip,
  metadata: { reason: 'Inappropriate content' }
});
```

### For Administrators
```bash
# Check recent operations
GET /api/admin/audit-logs?limit=50

# Monitor for deletions
grep "DB_DELETE" application.log

# Find who deleted a specific record
SELECT * FROM audit_logs 
WHERE table_name = 'messages' 
AND record_id = 'specific-uuid' 
AND action = 'DELETE';
```

## ⚠️ **Important Notes**

1. **No Hard Deletes**: The system never permanently deletes user data
2. **Performance**: Soft deletes may impact query performance on large datasets
3. **Storage**: Deleted records still consume database space
4. **Privacy**: Consider GDPR "right to be forgotten" requirements
5. **Maintenance**: Periodic cleanup of old deleted records may be needed

## 🎯 **Benefits Summary**

✅ **Data Safety**: No accidental data loss  
✅ **Audit Compliance**: Complete operation tracking  
✅ **Security Monitoring**: Detect unauthorized access  
✅ **Recovery Options**: Restore deleted data  
✅ **Debugging**: Track down issues and errors  
✅ **Legal Protection**: Evidence of proper data handling